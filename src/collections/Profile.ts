import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../lib/revalidatePage'

export const Profile: CollectionConfig = {
  slug: 'profile',
  admin: {
    group: 'System',
    useAsTitle: 'name',
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
      label: 'Full Name',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Professional Title / Tagline',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      label: 'Profile Picture',
    },
    {
      name: 'about',
      type: 'richText',
      label: 'About Me',
    },
    {
      name: 'currentStatus',
      type: 'text',
      label: 'Current Status (e.g., "Building cool stuff")',
    },
    {
      name: 'currentProject',
      type: 'text',
      label: 'Currently Working On',
    },
    {
      name: 'currentLearning',
      type: 'text',
      label: 'Currently Learning/Reading',
    },
  ],
}
