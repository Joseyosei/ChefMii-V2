import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = cookies()
        const supabase = createServerClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll() },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    },
                },
            }
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data?.user) {
            // Ensure profile exists (first OAuth login)
            const { data: existing } = await supabase
                .from('profiles')
                .select('id, role')
                .eq('id', data.user.id)
                .maybeSingle()

            if (!existing) {
                // Create profile for OAuth user
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    email: data.user.email ?? '',
                    full_name: data.user.user_metadata?.full_name ?? data.user.user_metadata?.name ?? null,
                    avatar_url: data.user.user_metadata?.avatar_url ?? null,
                    role: (data.user.user_metadata?.role as string) ?? 'client',
                })
            }

            const role = existing?.role ?? 'client'
            const dashboardUrl =
                role === 'chef' ? '/chef-dashboard' :
                    role === 'business' ? '/business-dashboard' :
                        role === 'influencer' ? '/influencer-dashboard' :
                            role === 'farmer' ? '/farmer-dashboard' :
                                role === 'kids' ? '/kids-dashboard' :
                                    '/user-dashboard'

            return NextResponse.redirect(new URL(dashboardUrl, requestUrl.origin))
        }
    }

    // Auth error — redirect to login with error
    return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin))
}
