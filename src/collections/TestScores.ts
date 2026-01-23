import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../lib/revalidatePage'

export const TestScores: CollectionConfig = {
  slug: 'test-scores',
  admin: {
    group: 'Resume',
    useAsTitle: 'title',
    defaultColumns: ['title', 'score', 'date'],
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
      label: 'Title',
    },
    {
      name: 'associatedWith',
      type: 'text',
      label: 'Associated With',
    },
    {
      name: 'score',
      type: 'text',
      required: true,
      label: 'Score',
    },
    {
      name: 'date',
      type: 'date',
      label: 'Test Date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
      },
    },
    {
      name: 'documents',
      type: 'array',
      label: 'Documents / Certificates',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Document Title',
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'File',
        },
        {
          name: 'externalUrl',
          type: 'text',
          label: 'External URL (optional alternative)',
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
  ],
}
