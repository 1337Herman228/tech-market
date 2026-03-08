import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrOwner } from './access/index'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['product', 'author', 'rating', 'verified', 'createdAt'],
  },
  access: {
    read: () => true,           // public — shown on product pages
    create: ({ req }) => Boolean(req.user),  // must be logged in
    update: isAdminOrOwner,     // owner can edit their own review
    delete: isAdminOrOwner,
  },
  hooks: {
    // Auto-assign the logged-in user as author on creation
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.author = req.user.id
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      // Hidden in create form — set automatically via hook
      admin: {
        readOnly: true,
        condition: (data) => Boolean(data?.author),
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      admin: {
        description: 'Rating from 1 to 5 stars.',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        placeholder: 'e.g. Great laptop for developers',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      // Can only be set by admins — marks "verified purchase"
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: ({ req }) => req.user?.role === 'ADMIN',
        update: ({ req }) => req.user?.role === 'ADMIN',
      },
    },
  ],
}