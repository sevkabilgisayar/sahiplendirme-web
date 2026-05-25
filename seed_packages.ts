import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const servicesList = [
  {
    name: 'Mağaza Açmak (E-Ticaret)',
    price: 299,
    features: JSON.stringify(['Fiziksel ürün (mama, tasma, oyuncak vb.) satışı yapın']),
  },
  {
    name: 'Veteriner Kliniği',
    price: 199,
    features: JSON.stringify(['Veteriner hizmetlerinizi listeleyin ve randevu alın']),
  },
  {
    name: 'Pet Kuaför',
    price: 149,
    features: JSON.stringify(['Kuaför ve bakım hizmetlerinizi hayvanseverlere sunun']),
  },
  {
    name: 'Köpek Eğitmeni',
    price: 149,
    features: JSON.stringify(['Eğitim paketlerinizi satın ve yeni öğrenciler bulun']),
  },
  {
    name: 'Pet Otel & Konaklama',
    price: 199,
    features: JSON.stringify(['Tesisinizi tanıtın ve rezervasyon almaya başlayın']),
  },
  {
    name: 'Köpek Gezdirici',
    price: 99,
    features: JSON.stringify(['Günlük yürüyüş hizmetlerinizi bölgesel olarak listeleyin']),
  }
]

async function main() {
  for (const service of servicesList) {
    const existing = await prisma.package.findFirst({
      where: { name: service.name }
    })
    
    if (!existing) {
      await prisma.package.create({
        data: {
          name: service.name,
          price: service.price,
          features: service.features,
          isActive: true
        }
      })
      console.log(`Eklendi: ${service.name}`)
    } else {
      console.log(`Zaten var: ${service.name}`)
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
