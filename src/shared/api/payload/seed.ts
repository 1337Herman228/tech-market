import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from './payload.config'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const DUMMY_IMAGE_PATH = path.resolve(dirname, 'dummy.png')

async function seed() {
  try {
    const payload = await getPayload({ config: configPromise })

    payload.logger.info('Seeding database...')

    // --- CLEAR EXISTING DATA ---
    const collectionsToClear = ['reviews', 'wishlist', 'cart', 'products', 'categories', 'brands', 'users', 'media'] as const
    payload.logger.info('Clearing existing data...')
    for (const collection of collectionsToClear) {
      try {
        const result = await payload.find({ collection, limit: 1000 })
        for (const doc of result.docs) {
          await payload.delete({ collection, id: doc.id })
        }
        if (result.totalDocs > 0) {
           payload.logger.info(`Cleared ${result.totalDocs} documents from ${collection}`)
        }
      } catch (err) {
        payload.logger.error(`Failed to clear ${collection}: ${err}`)
      }
    }

    // Create a 1x1 transparent PNG for dummy uploads
    const dummyImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64')
    fs.writeFileSync(DUMMY_IMAGE_PATH, dummyImageBuffer)

    // 1. Create User
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'ADMIN',
      },
    })
    payload.logger.info('User created')

    // 2. Create Media
    const media = await payload.create({
      collection: 'media',
      data: {
        alt: 'Dummy Image',
      },
      file: {
        data: fs.readFileSync(DUMMY_IMAGE_PATH),
        mimetype: 'image/png',
        name: 'dummy.png',
        size: fs.statSync(DUMMY_IMAGE_PATH).size,
      },
    })
    payload.logger.info('Media created')

    // 3. Create Brand
    const brand = await payload.create({
      collection: 'brands',
      data: {
        name: 'TechCorp',
        slug: 'techcorp',
        website: 'https://example.com/techcorp',
        description: 'Leading innovator in electronics.',
        logo: media.id,
      },
    })
    payload.logger.info('Brand created')

    // 4. Create Category
    const category = await payload.create({
      collection: 'categories',
      data: {
        name: 'Laptops',
        slug: 'laptops',
        description: 'High performance portable computers',
        image: media.id,
      },
    })
    payload.logger.info('Category created')

    // 5. Create Product
    const product = await payload.create({
      collection: 'products',
      data: {
        name: 'Pro Laptop 15"',
        slug: 'pro-laptop-15',
        price: 1299.99,
        compareAtPrice: 1499.99,
        stock: 50,
        sku: 'LAPTOP-PRO-15',
        status: 'published',
        featured: true,
        category: category.id,
        brand: brand.id,
        shortDescription: 'The ultimate laptop for professionals.',
        description: {
          root: {
            children: [
              {
                children: [
                  { detail: 0, format: 0, mode: 'normal', style: '', text: 'A premium laptop.', type: 'text', version: 1 }
                ],
                direction: 'ltr', format: '', indent: 0, type: 'paragraph', version: 1
              }
            ],
            direction: 'ltr', format: '', indent: 0, type: 'root', version: 1
          }
        },
        images: [
          {
            image: media.id,
            alt: 'Laptop image',
          },
        ],
        specs: [
          { key: 'RAM', value: '16GB' },
          { key: 'Storage', value: '512GB SSD' },
          { key: 'Processor', value: 'M2 Chip' },
        ],
      },
    })
    payload.logger.info('Product created')

    // 6. Add Product to User's Cart
    await payload.create({
      collection: 'cart',
      data: {
        owner: user.id,
        items: [
          {
            product: product.id,
            quantity: 1,
            priceAtAdd: product.price,
          },
        ],
      },
    })
    payload.logger.info('Product added to Cart')

    // 7. Add Product to User's Wishlist
    await payload.create({
      collection: 'wishlist',
      data: {
        owner: user.id,
        products: [product.id],
      },
    })
    payload.logger.info('Product added to Wishlist')

    // 8. Add Review for Product
    await payload.create({
      collection: 'reviews',
      data: {
        product: product.id,
        author: user.id,
        rating: 5,
        title: 'Amazing Laptop!',
        body: 'This laptop completely blew away my expectations.',
        verified: true,
      },
    })
    payload.logger.info('Product Review created')

    // Clean up dummy image
    if (fs.existsSync(DUMMY_IMAGE_PATH)) fs.unlinkSync(DUMMY_IMAGE_PATH)

    payload.logger.info('Seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)
    if (fs.existsSync(DUMMY_IMAGE_PATH)) fs.unlinkSync(DUMMY_IMAGE_PATH)
    process.exit(1)
  }
}

seed()
