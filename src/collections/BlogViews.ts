import type { CollectionConfig } from 'payload'

export const BlogViews: CollectionConfig = {
  slug: 'blog-views',
  admin: {
    group: 'System',
    useAsTitle: 'blogSlug',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'blogSlug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'hash',
      type: 'text',
      required: true,
      index: true,
    },
  ],
}
