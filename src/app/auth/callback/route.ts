// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// // esto es una opcion de Nextjs para evitar que cachee de forma estatica la ruta
// // y que siempre se ejecute en el servidor
// export const dynamic = 'force-dynamic'

// export async function GET (request: NextRequest) {
//     //este codigo es de la plataforma web
//     const requestUrl = new URL(request.url)
//     const code = requestUrl.searchParams.get('code')

//     if (code !== null) {
//         const supabase = createRouteHandlerClient({cookies})
//         // usando el codigo que le hemos pasado por URL nos devuelve la sesion del usuario
//         await supabase.auth.exchangeCodeForSession(code)            
//     }

//     return NextResponse.redirect(requestUrl.origin)

// }

import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/app/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}