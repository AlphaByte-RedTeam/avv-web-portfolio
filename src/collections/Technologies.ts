import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../lib/revalidatePage'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    group: 'System',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'priority'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: 'Technology Name',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Programming Language', value: 'programming_language' },
        { label: 'Framework', value: 'framework' },
        { label: 'Database', value: 'database' },
      ],
      label: 'Category',
    },
    {
      name: 'priority',
      type: 'number',
      required: false,
      defaultValue: 0,
      label: 'Priority (Higher shows first)',
    },
  ],
}
