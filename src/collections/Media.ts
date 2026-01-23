import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../lib/revalidatePage'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'System',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidatePage],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
