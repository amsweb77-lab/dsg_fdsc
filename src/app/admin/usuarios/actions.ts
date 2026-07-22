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

export async function updateUser(formData: FormData) {
  const id = formData.get('id') as string
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as 'ADMIN' | 'FISCAL'
  const password = formData.get('password') as string

  if (!id || !email || !name || !role) {
    return { error: 'Preencha os campos obrigatórios' }
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing && existing.id !== id) return { error: 'E-mail já cadastrado por outro usuário' }

  const data: any = { email, name, role }
  
  if (password && password.trim().length > 0) {
    if (password.length < 6) return { error: 'A senha deve ter no mínimo 6 caracteres' }
    data.password = await bcrypt.hash(password, 10)
  }

  await prisma.user.update({
    where: { id },
    data
  })

  revalidatePath('/admin/usuarios')
  return { success: true }
}
