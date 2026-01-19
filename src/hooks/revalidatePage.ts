import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

export const revalidatePage: CollectionAfterChangeHook & CollectionAfterDeleteHook = ({ doc }) => {
  revalidatePath('/')
  return doc
}
