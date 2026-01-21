import type { CollectionBeforeChangeHook } from 'payload'

export const generateIdCode: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (operation === 'create') {
    const { payload } = req

    // Find the latest referral created to determine the next sequence
    // We use createdAt because lexicographical sort of idCode fails when transitioning from Z999 (starts with Z) to AA01 (starts with A)
    const { docs: latestReferrals } = await payload.find({
      collection: 'referrals',
      sort: '-createdAt',
      limit: 1,
      depth: 0,
    })

    let nextCode = '0001'

    if (latestReferrals.length > 0 && latestReferrals[0].idCode) {
      const lastCode = latestReferrals[0].idCode as string

      // Case 1: 0001 - 9999
      if (/^\d{4}$/.test(lastCode)) {
        const num = parseInt(lastCode, 10)
        if (num < 9999) {
          nextCode = (num + 1).toString().padStart(4, '0')
        } else {
          nextCode = 'A001'
        }
      }
      // Case 2: A001 - Z999
      else if (/^[A-Z]\d{3}$/.test(lastCode)) {
        const char = lastCode[0]
        const num = parseInt(lastCode.slice(1), 10)

        if (num < 999) {
          nextCode = char + (num + 1).toString().padStart(3, '0')
        } else {
          // Increment char
          if (char === 'Z') {
            // Z999 -> AA01
            nextCode = 'AA01'
          } else {
            const nextChar = String.fromCharCode(char.charCodeAt(0) + 1)
            nextCode = nextChar + '001'
          }
        }
      }
      // Case 3: AA01 - ZZ99
      else if (/^[A-Z]{2}\d{2}$/.test(lastCode)) {
        const chars = lastCode.slice(0, 2)
        const num = parseInt(lastCode.slice(2), 10)

        if (num < 99) {
          nextCode = chars + (num + 1).toString().padStart(2, '0')
        } else {
          // Increment chars: AA -> AB, AZ -> BA, ZZ -> AAA1
          const firstChar = chars[0]
          const secondChar = chars[1]

          if (secondChar < 'Z') {
            const nextSecond = String.fromCharCode(secondChar.charCodeAt(0) + 1)
            nextCode = firstChar + nextSecond + '01'
          } else {
            // Second char is Z (e.g. AZ, BZ, ZZ)
            if (firstChar < 'Z') {
              const nextFirst = String.fromCharCode(firstChar.charCodeAt(0) + 1)
              nextCode = nextFirst + 'A' + '01' // AZ99 -> BA01
            } else {
              // ZZ99 -> AAA1
              nextCode = 'AAA1'
            }
          }
        }
      }
      // Case 4: AAA1 - ZZZ9 (Fallback/Extension)
      else if (/^[A-Z]{3}\d{1}$/.test(lastCode)) {
        const chars = lastCode.slice(0, 3)
        const num = parseInt(lastCode.slice(3), 10)
        if (num < 9) {
          nextCode = chars + (num + 1).toString()
        } else {
          // AAA9 -> AAB1
          // Simplified logic for now:
          nextCode = 'AAAA' // Just a fallback to indicate overflow/new pattern
        }
      }
    }

    data.idCode = nextCode
  }

  return data
}
