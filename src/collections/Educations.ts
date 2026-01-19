import type { CollectionConfig } from 'payload'

export const Educations: CollectionConfig = {
  slug: 'educations',
  admin: {
    useAsTitle: 'institution',
  },
  access: {
    read: () => true,
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
          pickerAppearance: 'yearOnly',
          displayFormat: 'yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'yearOnly',
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
