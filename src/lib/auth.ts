import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'secret-dsg-key-2026-super-secure-dev'
const key = new TextEncoder().encode(secretKey)

export type JWTPayload = {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'FISCAL'
}

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return payload as JWTPayload
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('dsg_session')?.value
  if (!token) return null
  return await decrypt(token)
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('dsg_session')
}
