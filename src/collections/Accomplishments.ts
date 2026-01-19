import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../hooks/revalidatePage'

export const Accomplishments: CollectionConfig = {
  slug: 'accomplishments',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'issuer', 'date'],
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
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Certification', value: 'certification' },
        { label: 'Project', value: 'project' },
        { label: 'Language', value: 'language' },
        { label: 'Organization', value: 'organization' },
        { label: 'Award', value: 'award' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'issuer',
      type: 'text',
      label: 'Issuer / Organization',
    },
    {
      name: 'date',
      type: 'date',
      label: 'Issued Date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
      },
    },
    {
      name: 'credentialId',
      type: 'text',
      label: 'Credential ID',
    },
    {
      name: 'credentialUrl',
      type: 'text',
      label: 'Credential URL',
    },
    {
      name: 'description',
      type: 'richText',
    },
  ],
}
