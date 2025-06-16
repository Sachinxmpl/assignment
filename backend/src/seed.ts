import dbclient from '../src/config/db';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('adminlogin', 10);
  await dbclient.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
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

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
  })
  .finally(async () => {
    await dbclient.$disconnect();
  });