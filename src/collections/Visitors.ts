import type { CollectionConfig } from 'payload'

export const Visitors: CollectionConfig = {
  slug: 'visitors',
  admin: {
    group: 'System',
    useAsTitle: 'hash',
    defaultColumns: ['date', 'hash'],
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
  ],
}