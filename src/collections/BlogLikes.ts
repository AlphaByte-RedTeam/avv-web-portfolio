import type { CollectionConfig } from 'payload'

export const BlogLikes: CollectionConfig = {
  slug: 'blog-likes',
  admin: {
    group: 'System',
    useAsTitle: 'blogSlug',
  },
  access: {
    read: () => true,
    create: () => true,
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
