import type { CollectionConfig } from 'payload'
import { isAdminOrOwner } from './access/index'

export const Wishlist: CollectionConfig = {
  slug: 'wishlist',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['owner', 'updatedAt'],
  },
  access: {
    read: isAdminOrOwner,
    create: ({ req }) => Boolean(req.user),
    update: isAdminOrOwner,
    delete: isAdminOrOwner,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.owner = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true, // one wishlist per user
    },
    {
      // hasMany relationship — array of product references
      // Much simpler than Cart because no quantity/price needed
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
  ],
}