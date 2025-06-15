import dbclient from '../src/config/db';
import bcrypt from 'bcryptjs';

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await dbclient.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  });

  // Create categories
  const categories = [
    { name: 'Fiction' },
    { name: 'Non-Fiction' },
    { name: 'Science' },
    { name: 'History' },
  ];

  for (const category of categories) {
    await dbclient.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
  await dbclient.book.createMany({
    data: [
      {
        title: 'Sample Book 1',
        author: 'Author 1',
        description: 'A fascinating tale of adventure.',
        categoryId: 1,
        coverImage: 'https://via.placeholder.com/150',
        ebookUrl: 'https://via.placeholder.com/sample.pdf',
        totalCopies: 5,
        borrowedCopies: 0,
      },
      {
        title: 'Sample Book 2',
        author: 'Author 2',
        description: 'A deep dive into scientific discoveries.',
        categoryId: 3,
        coverImage: 'https://via.placeholder.com/150',
        ebookUrl: 'https://via.placeholder.com/sample.pdf',
        totalCopies: 3,
        borrowedCopies: 0,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
  })
  .finally(async () => {
    await dbclient.$disconnect();
  });