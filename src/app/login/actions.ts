'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Preencha todos os campos' }

  let user = await prisma.user.findUnique({ where: { email } })
  
  // Auto-criação do admin no primeiro login para facilitar
  if (!user && email === 'admin@dsg.com' && password === '123456') {
    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 10)
      user = await prisma.user.create({
        data: {
          email: 'admin@dsg.com',
          password: hashedPassword,
          name: 'Chefe DSG',
          role: 'ADMIN'
        }
      })
    }
  }

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
