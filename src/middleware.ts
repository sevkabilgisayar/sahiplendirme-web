import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 1. Müşteriniz için özel erişim kontrolü
  // Eğer urlde ?vip=1 parametresi varsa, cookie oluştur ve siteye girmesine izin ver
  if (url.searchParams.get('vip') === '1') {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('vip_access', 'true', { maxAge: 60 * 60 * 24 * 7 }); // 1 haftalık VIP geçiş
    return response;
  }

  // 2. Cookie varsa (müşteri VIP ise) veya Admin api rotalarıysa engelleme
  const hasVipAccess = request.cookies.has('vip_access');
  if (hasVipAccess) {
    return NextResponse.next();
  }

  // 3. Zaten bakım sayfasındaysa veya statik dosyalarsa döngüye girmesin
  if (
    url.pathname.startsWith('/bakim') || 
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.includes('.') // resim, css vb.
  ) {
    return NextResponse.next();
  }

  // 4. Diğer herkesi Bakım sayfasına yönlendir
  url.pathname = '/bakim';
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
