import type { CollectionConfig } from 'payload'
import { isAdmin } from './access/index'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'brand', 'category', 'price', 'stock', 'status'],
    // Preview URL for the storefront
    preview: (doc) => `${process.env.NEXT_PUBLIC_SERVER_URL}/products/${doc.slug}`,
  },
  access: {
    read: () => true,   // public catalog
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // ─── CORE INFO ──────────────────────────────────────────────────────────
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
      admin: {
        description: 'Auto-filled from name. Used in product URL.',
      },
    },
    {
      name: 'description',
      type: 'richText', // Lexical editor — supports bold, lists, links etc.
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      admin: {
        description: 'Short summary shown on product cards.',
      },
    },

    // ─── MEDIA ──────────────────────────────────────────────────────────────
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },

    // ─── RELATIONS ──────────────────────────────────────────────────────────
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      // Enables filtering products by category
      hasMany: false,
    },
    {
      name: 'brand',
      type: 'relationship',
      relationTo: 'brands',
      required: true,
    },

    // ─── PRICING & INVENTORY ────────────────────────────────────────────────
    {
      // Two-column layout in the admin panel
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: { width: '50%' },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          min: 0,
          admin: {
            width: '50%',
            description: 'Original price for showing discounts.',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'stock',
          type: 'number',
          required: true,
          defaultValue: 0,
          min: 0,
          admin: { width: '50%' },
        },
        {
          name: 'sku',
          type: 'text',
          unique: true,
          admin: { width: '50%' },
        },
      ],
    },

    // ─── SPECS ──────────────────────────────────────────────────────────────
    // Flexible key-value pairs for tech specs
    // e.g. { key: "RAM", value: "16GB" }
    {
      name: 'specs',
      type: 'array',
      admin: {
        description: 'Technical specifications shown on product page.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'key',
              type: 'text',
              required: true,
              admin: { width: '40%', placeholder: 'e.g. RAM' },
            },
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { width: '60%', placeholder: 'e.g. 16GB DDR5' },
            },
          ],
        },
      ],
    },

    // ─── STATUS ─────────────────────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      required: true,
      // Only published products appear in the storefront
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage featured section.',
      },
    },
  ],
}