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
    beforeChange: [
      ({ data }) => {
        return {
          ...data,
          lastUpdated: new Date().toISOString(),
        }
      },
    ],
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
      name: 'description',
      type: 'textarea',
      label: 'Short Summary',
      required: true,
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
        date: {
          displayFormat: 'MMM d, yyyy HH:mm',
        },
      },
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
          pickerAppearance: 'dayOnly',
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
