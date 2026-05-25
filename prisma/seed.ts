import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@sahiplendirme.com' },
    update: {},
    create: {
      firstName: 'Ayşe',
      lastName: 'Yılmaz',
      email: 'test@sahiplendirme.com',
      password: hashedPassword,
      phone: '0555 555 5555',
      city: 'İstanbul',
      accountType: 'bireysel',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
  });

  // 2. Create some listings
  await prisma.listing.create({
    data: {
      type: 'sahiplendirme',
      animal: 'kopek',
      title: 'Golden Retriever Yavruları',
      name: 'Max & Bella',
      breed: 'Golden Retriever',
      age: '2 Aylık',
      gender: 'Erkek',
      description: 'Çok sevimli 2 adet golden yavrumuz ücretsiz sahiplendirilecektir. Aşıları yapılmıştır.',
      city: 'İstanbul',
      district: 'Kadıköy',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
        'https://images.unsplash.com/photo-1537151608804-ea2d14ac37cd?w=800'
      ]),
      status: 'approved',
      aiScore: 95,
      userId: user.id,
    }
  });

  await prisma.listing.create({
    data: {
      type: 'kayip',
      animal: 'kedi',
      title: 'Kadıköy\'de Tekir Kedimiz Kayboldu',
      name: 'Pamuk',
      breed: 'Tekir',
      age: '3 Yaşında',
      gender: 'Dişi',
      description: 'Beyaz patili tekir kedimiz Moda sahil civarında kayboldu. Kırmızı tasması var.',
      city: 'İstanbul',
      district: 'Kadıköy',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800'
      ]),
      status: 'approved',
      aiScore: 88,
      lossTime: 'Dün akşam',
      hasReward: true,
      rewardAmount: '5.000 TL',
      userId: user.id,
    }
  });

  await prisma.listing.create({
    data: {
      type: 'ciftlestirme',
      animal: 'kedi',
      title: 'Safkan British Shorthair Eş Arıyor',
      name: 'Duman',
      breed: 'British Shorthair',
      age: '2 Yaşında',
      gender: 'Erkek',
      description: 'Aşıları tam, secerekli erkek British Shorthair kedimiz için eş arıyoruz.',
      city: 'Ankara',
      district: 'Çankaya',
      photos: JSON.stringify([
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800'
      ]),
      status: 'approved',
      aiScore: 92,
      userId: user.id,
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
