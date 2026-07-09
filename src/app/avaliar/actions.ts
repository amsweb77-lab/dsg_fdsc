'use server'

import prisma from '@/lib/prisma';

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
    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error saving avaliacao:", error);
    return { success: false, error: 'Falha ao salvar avaliação. Tente novamente.' };
  }
}
