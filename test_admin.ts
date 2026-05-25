import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: { OR: [{ role: 'admin' }, { accountType: 'ADMIN' }] }
  })
  console.log("Admins:", users)
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
