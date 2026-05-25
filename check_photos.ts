import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const listing = await prisma.listing.findUnique({
    where: { id: '6714a0a0-412a-468b-a992-d28285768b95' }
  })
  console.log(listing?.photos)
}
check()
