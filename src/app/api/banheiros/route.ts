import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const banheiros = await prisma.banheiroLocal.findMany({
      orderBy: { nome: 'asc' }
    });
    return NextResponse.json(banheiros);
  } catch (error) {
    console.error('Error fetching banheiros:', error);
    return NextResponse.json({ error: 'Erro ao buscar banheiros' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    if (!body.nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const novoBanheiro = await prisma.banheiroLocal.create({
      data: { nome: body.nome },
    });

    return NextResponse.json(novoBanheiro, { status: 201 });
  } catch (error) {
    console.error('Error creating banheiro:', error);
    return NextResponse.json({ error: 'Erro ao criar banheiro' }, { status: 500 });
  }
}
