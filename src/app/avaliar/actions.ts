'use server'

import prisma from '@/lib/prisma';

import { revalidatePath } from 'next/cache';

export async function saveAvaliacao(data: {
  banheiroId: string;
  limpeza: string;
  papelHigienico: boolean;
  saboneteLiquido: boolean;
  conservacao: string;
  observacoes: string;
}) {
  try {
    const result = await prisma.avaliacao.create({
      data: {
        banheiroId: data.banheiroId,
        limpeza: data.limpeza,
        papelHigienico: data.papelHigienico,
        saboneteLiquido: data.saboneteLiquido,
        conservacao: data.conservacao,
        observacoes: data.observacoes || null,
      }
    });
    
    revalidatePath('/', 'layout');
    
    return { success: true, id: result.id };
  } catch (error: any) {
    console.error("Error saving avaliacao:", error);
    return { success: false, error: 'Erro: ' + (error?.message || 'Falha desconhecida') };
  }
}
