import type { CollectionConfig } from 'payload'

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  admin: {
    useAsTitle: 'organization',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'organization',
      type: 'text',
      required: true,
      label: 'Organization Name',
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      label: 'Role / Position',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
        description: 'Leave blank if currently active',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Organization Logo',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description / Responsibilities',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
    },
  ],
}
