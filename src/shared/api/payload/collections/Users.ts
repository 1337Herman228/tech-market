import type { CollectionConfig } from 'payload'
import { isAdmin } from './access/index'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Payload handles password hashing, sessions, JWT automatically
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
  },
  access: {
    read: isAdmin,       // only admins can list all users in admin panel
    create: () => true,  // anyone can register
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'User', value: 'USER' },
        { label: 'Admin', value: 'ADMIN' },
      ],
      defaultValue: 'USER',
      required: true,
      // Only admins can change roles — prevents privilege escalation
      access: {
        update: ({ req }) => req.user?.role === 'ADMIN',
      },
    },
  ],
}