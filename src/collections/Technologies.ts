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
        { label: 'Dev Tools', value: 'devtools' },
      ],
      label: 'Category',
    },
    {
      name: 'tool_url',
      type: 'text',
      label: 'Tool URL',
      admin: {
        description: 'URL to the tool (e.g., download or home page)',
      },
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
