import type { CollectionConfig } from 'payload'

export const DailyMetrics: CollectionConfig = {
  slug: 'daily-metrics',
  admin: {
    group: 'System',
    useAsTitle: 'date',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'date',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'count',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
  ],
}
