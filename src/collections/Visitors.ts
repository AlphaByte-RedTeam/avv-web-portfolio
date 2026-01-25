import type { CollectionConfig } from 'payload'

export const Visitors: CollectionConfig = {
  slug: 'visitors',
  admin: {
    group: 'System',
    useAsTitle: 'hash',
    defaultColumns: ['date', 'hash', 'country', 'deviceType'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hash',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'date',
      type: 'text', // YYYY-MM-DD
      required: true,
      index: true,
    },
    {
      name: 'country',
      type: 'text',
      index: true,
    },
    {
      name: 'deviceType',
      type: 'select',
      options: [
        { label: 'Mobile', value: 'mobile' },
        { label: 'Desktop', value: 'desktop' },
        { label: 'Tablet', value: 'tablet' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'desktop',
    },
  ],
}
