import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const id = (await params).id;
    const body = await request.json();
    
    if (!body.nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
    }

    const banheiroAtualizado = await prisma.banheiroLocal.update({
      where: { id },
      data: { nome: body.nome },
    });

    return NextResponse.json(banheiroAtualizado);
  } catch (error) {
    console.error('Error updating banheiro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar banheiro' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const id = (await params).id;

    await prisma.banheiroLocal.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Banheiro excluído com sucesso' });
  } catch (error) {
    console.error('Error deleting banheiro:', error);
    return NextResponse.json({ error: 'Erro ao excluir banheiro' }, { status: 500 });
  }
}
