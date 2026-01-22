import { getPayload } from 'payload'
import config from '@/payload.config'
import React from 'react'
import { PromptsClient } from './PromptsClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompts Library | AVV',
  description: 'A curated collection of AI prompts.',
}

export default async function PromptsPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const prompts = await payload.find({
    collection: 'prompts',
    limit: 100,
    sort: '-updatedAt',
  })

  return <PromptsClient prompts={prompts.docs as any} />
}
