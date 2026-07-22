'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Preencha todos os campos' }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return { error: 'Credenciais inválidas' }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return { error: 'Credenciais inválidas' }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ id: user.id, email: user.email, name: user.name || '', role: user.role })

  const cookieStore = await cookies()
  cookieStore.set('dsg_session', session, { expires, httpOnly: true })

  return { success: true, role: user.role }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('dsg_session')
}
