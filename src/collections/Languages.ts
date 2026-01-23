import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../lib/revalidatePage'

export const Languages: CollectionConfig = {
  slug: 'languages',
  admin: {
    group: 'System',
    useAsTitle: 'language',
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
      name: 'language',
      type: 'text',
      required: true,
      label: 'Language Name',
    },
    {
      name: 'proficiency',
      type: 'select',
      required: true,
      options: [
        { label: 'Native or Bilingual', value: 'native_bilingual' },
        { label: 'Full Professional', value: 'full_professional' },
        { label: 'Professional Working', value: 'professional_working' },
        { label: 'Limited Working', value: 'limited_working' },
        { label: 'Elementary', value: 'elementary' },
      ],
      label: 'Proficiency Level',
    },
  ],
}
