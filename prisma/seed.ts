import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Super Admin
  const superAdminEmail = 'superadmin@example.com';
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash('SuperAdminPassword123!', 10);
    const superAdmin = await prisma.user.create({
      data: {
        email: superAdminEmail,
        password: hashedPassword,
        name: 'Super Admin User',
        role: Role.SUPER_ADMIN,
        isVerified: true,
      },
    });
    console.log(`✅ Created Super Admin user: ${superAdmin.email}`);
  } else {
    console.log('ℹ️ Super Admin user already exists.');
  }

  // Seed Categories
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets, components, and electronics' },
    { name: 'Books', slug: 'books', description: 'Physical and digital books' },
    { name: 'Clothing', slug: 'clothing', description: 'Apparel and fashion items' },
  ];

  const createdCategories: Record<string, string> = {};

  for (const cat of categoriesData) {
    let category = await prisma.category.findUnique({
      where: { slug: cat.slug },
    });
    if (!category) {
      category = await prisma.category.create({ data: cat });
      console.log(`✅ Created Category: ${category.name}`);
    }
    createdCategories[cat.slug] = category.id;
  }

  // Seed Products
  const electronicsId = createdCategories['electronics'];
  if (electronicsId) {
    const productsData = [
      {
        name: 'Smartphone X',
        slug: 'smartphone-x',
        description: 'Next-gen flagship smartphone',
        price: 999.99,
        stock: 50,
        categoryId: electronicsId,
        images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
      },
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Noise-cancelling wireless over-ear headphones',
        price: 199.99,
        stock: 100,
        categoryId: electronicsId,
        images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'],
      },
    ];

    for (const prod of productsData) {
      const existingProd = await prisma.product.findUnique({
        where: { slug: prod.slug },
      });
      if (!existingProd) {
        const newProd = await prisma.product.create({ data: prod });
        console.log(`✅ Created Product: ${newProd.name}`);
      }
    }
  }

  console.log('🌱 Seeding complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
