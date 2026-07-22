import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (adminExists) {
      return NextResponse.json({ message: 'Admin já existe' })
    }

    const hashedPassword = await bcrypt.hash('123456', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@dsg.com',
        password: hashedPassword,
        name: 'Chefe DSG',
        role: 'ADMIN'
      }
    })

    return NextResponse.json({ message: 'Admin criado com sucesso', email: admin.email })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
