import type { CollectionConfig } from 'payload'
import { revalidatePage } from '../lib/revalidatePage'
import { generateIdCode } from '../lib/generateIdCode'

export const Referrals: CollectionConfig = {
  slug: 'referrals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'idCode', 'isShow', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [generateIdCode],
    afterChange: [revalidatePage],
    afterDelete: [revalidatePage],
  },
  fields: [
    {
      name: 'idCode',
      type: 'text',
      label: 'ID Code',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'isShow',
      type: 'checkbox',
      label: 'Show in List',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
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
