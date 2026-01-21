import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../hooks/revalidatePage'

export const Referrals: CollectionConfig = {
  slug: 'referrals',
  admin: {
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
      label: 'Service/Product Name',
    },
    {
      name: 'code',
      type: 'text',
      label: 'Referral Code',
    },
    {
      name: 'link',
      type: 'text',
      required: true,
      label: 'Referral Link',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image/Logo',
    },
  ],
}
