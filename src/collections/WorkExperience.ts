import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../lib/revalidatePage'

export const WorkExperience: CollectionConfig = {
  slug: 'work-experience',
  admin: {
    group: 'Resume',
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
      label: 'Position Title',
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Institution / Company Name',
    },
    {
      name: 'jobType',
      type: 'select',
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Self-employed', value: 'self-employed' },
        { label: 'Internship', value: 'internship' },
        { label: 'Freelance', value: 'freelance' },
        { label: 'Contract', value: 'contract' },
      ],
      label: 'Job Type',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'monthOnly',
          displayFormat: 'MMM yyyy',
        },
        description: 'Leave blank if currently working here',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'linkedinUrl',
      type: 'text',
      label: 'LinkedIn URL',
    },
  ],
}
