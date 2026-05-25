import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-sahiplendirme-key';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      include: {
        listings: {
          orderBy: { createdAt: 'desc' }
        },
        applications: {
          include: {
            listing: true
          },
          orderBy: { createdAt: 'desc' }
        },
        orders: {
          include: {
            items: {
              include: { product: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          include: { product: true },
          orderBy: { createdAt: 'desc' }
        },
        coupons: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Fetch applications received for the user's listings
    const receivedApplications = await db.application.findMany({
      where: {
        listing: {
          userId: decoded.userId
        }
      },
      include: {
        listing: true,
        applicant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const fullProfile = {
      ...user,
      receivedApplications
    };

    return NextResponse.json({ success: true, profile: fullProfile });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json({ error: 'Geçersiz oturum', details: String(error) }, { status: 401 });
  }
}
