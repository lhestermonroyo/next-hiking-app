import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClientForServer } from './lib/supabase/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createClientForServer();

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}
