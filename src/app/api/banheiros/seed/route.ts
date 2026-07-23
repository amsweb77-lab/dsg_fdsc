import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const BANHEIROS_DATA = [
  { local: 'Forinho', andar: 'Térreo', ala: '1' },
  { local: 'Forinho', andar: 'Térreo', ala: '3' },
  { local: 'Forinho', andar: '1º Andar', ala: '1' },
  { local: 'Forinho', andar: '1º Andar', ala: '3' },
  { local: 'Anexo', andar: 'Térreo', ala: '6' },
  { local: 'Anexo', andar: 'Térreo', ala: '4' },
  { local: 'Anexo', andar: 'S1', ala: '1' },
  { local: 'Anexo', andar: 'S2', ala: '1' },
  { local: 'Anexo', andar: '1º Andar', ala: '4' },
  { local: 'Anexo', andar: '3º Andar', ala: '6' },
  { local: 'Anexo', andar: '3º Andar', ala: '4' },
  { local: 'Anexo', andar: '4º Andar', ala: '6' },
  { local: 'Anexo', andar: '4º Andar', ala: '4' },
  { local: 'Anexo', andar: '5º Andar', ala: '6' },
  { local: 'Anexo', andar: '5º Andar', ala: '4' },
  { local: 'Anexo', andar: '6º Andar', ala: '6' },
  { local: 'Anexo', andar: '6º Andar', ala: '4' },
  { local: 'Anexo', andar: '7º Andar', ala: '6' },
  { local: 'Anexo', andar: '7º Andar', ala: '4' },
];

const TIPOS = ['Masculino', 'Feminino', 'PCD'];

const BANHEIROS_LISTA = BANHEIROS_DATA.flatMap(b => 
  TIPOS.map(tipo => `${b.local} | ${b.andar} | Ala ${b.ala} | ${tipo}`)
);

export async function POST() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    let inseridos = 0;
    for (const nome of BANHEIROS_LISTA) {
      const exists = await prisma.banheiroLocal.findUnique({ where: { nome } });
      if (!exists) {
        await prisma.banheiroLocal.create({
          data: { nome }
        });
        inseridos++;
      }
    }

    return NextResponse.json({ message: `Seed concluído. ${inseridos} banheiros inseridos.` }, { status: 201 });
  } catch (error) {
    console.error('Error seeding banheiros:', error);
    return NextResponse.json({ error: 'Erro ao popular banheiros' }, { status: 500 });
  }
}
