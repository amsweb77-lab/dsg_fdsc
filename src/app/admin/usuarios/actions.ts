'use server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export async function createUser(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as 'ADMIN' | 'FISCAL'

  if (!email || !password || !name || !role) {
    return { error: 'Preencha todos os campos' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return { error: 'E-mail já cadastrado' }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role
    }
  })

  revalidatePath('/admin/usuarios')
  return { success: true }
}

export async function deleteUser(formData: FormData) {
  const id = formData.get('id') as string
  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/usuarios')
}
