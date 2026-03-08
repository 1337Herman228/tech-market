import type { CollectionConfig } from 'payload'
import { isAdminOrOwner } from './access/index'

export const Cart: CollectionConfig = {
  slug: 'cart',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['owner', 'updatedAt'],
    // Cart is user-facing data — hide from admin sidebar by default
    hidden: false,
  },
  access: {
    // Users can only see their own cart
    read: isAdminOrOwner,
    // Cart is created automatically — users don't create it manually
    create: ({ req }) => Boolean(req.user),
    update: isAdminOrOwner,
    delete: isAdminOrOwner,
  },
  hooks: {
    beforeChange: [
      // Auto-assign owner on cart creation
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
      unique: true, // one cart per user — enforced at DB level
    },
    {
      // Array of cart items — stored as embedded objects in the same row
      // No separate CartItem table needed — Payload handles this natively
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
              defaultValue: 1,
              min: 1,
              admin: { width: '50%' },
            },
            {
              // Snapshot of price at time of adding to cart
              // Important: product price may change later
              name: 'priceAtAdd',
              type: 'number',
              required: true,
              admin: {
                width: '50%',
                description: 'Price when item was added. Locked in.',
              },
            },
          ],
        },
      ],
    },
  ],
}