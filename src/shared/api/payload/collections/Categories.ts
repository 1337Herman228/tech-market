import type { CollectionConfig } from 'payload'
import { isAdmin } from './access/index'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent'],
  },
  access: {
    read: () => true,   // public — needed for storefront filters
    create: isAdmin,
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      // auto-generated from name in admin UI
      admin: {
        description: 'URL-friendly identifier. Auto-filled from name.',
      },
    },
    {
      // Self-relation: a category can have a parent category
      // e.g. "Laptops" → parent: "Computers"
      // This gives you unlimited nesting depth
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      required: false,
      admin: {
        description: 'Leave empty for top-level categories.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}