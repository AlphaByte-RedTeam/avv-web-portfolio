import type { CollectionConfig } from 'payload'

export const Profile: CollectionConfig = {
  slug: 'profile',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
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
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      label: 'Resume / CV',
    },
  ],
}
