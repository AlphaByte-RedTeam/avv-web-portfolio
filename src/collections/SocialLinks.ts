import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../hooks/revalidatePage'

export const SocialLinks: CollectionConfig = {
  slug: 'social-links',
  admin: {
    useAsTitle: 'platform',
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
      name: 'platform',
      type: 'text',
      required: true,
      label: 'Platform Name (e.g., LinkedIn, GitHub)',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL',
    },
    {
      name: 'label',
      type: 'text',
      label: 'Display Label (Optional)',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon Name (Lucide/Tabler)',
    },
  ],
}
