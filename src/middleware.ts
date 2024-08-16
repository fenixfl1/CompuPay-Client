import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { COOKIE_KEY_USER_DATA } from "@/constants/cookieKeys"
import {
  PATH_DASHBOARD,
  PATH_HOME,
  PATH_LOGIN,
  protectedRoutes,
  publicRoutes,
} from "@/constants/routes"
import { SessionPayload } from "./interfaces/user"
import { assert } from "./helpers/assert"
import jsonParse from "./helpers/jsonParse"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isProtected = protectedRoutes.includes(path)
  const isPublic = publicRoutes.includes(path)

  const session = jsonParse<SessionPayload>(
    cookies().get(COOKIE_KEY_USER_DATA)?.value ?? "{}"
  )

  if (isProtected && !session.USER_ID) {
    return NextResponse.redirect(new URL(PATH_LOGIN, request.url))
  }

  if (isPublic && session.USER_ID && path !== PATH_HOME) {
    return NextResponse.redirect(new URL(PATH_HOME, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets).*)"],
}
