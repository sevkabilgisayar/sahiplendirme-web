const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  await prisma.user.updateMany({
    data: {
      accountType: 'profesyonel',
      allowedServices: 'veteriner,kuafor,egitmen,otel,gezdirici',
      role: 'admin'
    }
  });
  console.log('All users upgraded to profesyonel and admin!');
}

run().finally(() => prisma.$disconnect());
