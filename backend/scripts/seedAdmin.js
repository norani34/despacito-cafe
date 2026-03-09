const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

(async () => {
  const prisma = new PrismaClient();
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@cafe.com';
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      console.error('ADMIN_PASSWORD not set in environment');
      process.exit(1);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('Admin user already exists:', email);
      process.exit(0);
    }

    const hash = await argon2.hash(password);
    await prisma.user.create({ data: { email, password: hash, role: 'ADMIN' } });
    console.log('Admin user created:', email);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
