import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../hooks/revalidatePage'

export const Educations: CollectionConfig = {
  slug: 'educations',
  admin: {
    useAsTitle: 'institution',
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
      name: 'degree',
      type: 'text',
      label: 'Degree',
    },
    {
      name: 'institution',
      type: 'text',
      required: true,
      label: 'Institution Name',
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'yyyy',
        },
        description: 'Leave blank if currently studying',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      label: 'LinkedIn URL',
    },
  ],
}
