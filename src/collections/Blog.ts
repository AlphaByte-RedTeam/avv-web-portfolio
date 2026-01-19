import type { CollectionConfig, FieldHook } from 'payload'
import { revalidatePage } from '../hooks/revalidatePage'

const format = (val: string): string =>
  val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase()

const formatSlug =
  (fallback: string): FieldHook =>
  ({ value, originalDoc, data }) => {
    if (typeof value === 'string') {
      return format(value)
    }
    const fallbackData = data?.[fallback] || originalDoc?.[fallback]

    if (fallbackData && typeof fallbackData === 'string') {
      return format(fallbackData)
    }

    return value
  }

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Blog Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Blog Content',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Blog Date',
      admin: {
        date: {
          pickerAppearance: 'day, month, year',
          displayFormat: 'MMM d, yyyy',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Technology', value: 'technology' },
        { label: 'Personal', value: 'personal' },
        { label: 'Tutorial', value: 'tutorial' },
        { label: 'Review', value: 'review' },
        { label: 'Other', value: 'other' },
      ],
    },
  ],
}
