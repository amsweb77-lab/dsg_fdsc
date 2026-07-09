'use server'

import prisma from '@/lib/prisma';

export async function saveChecklistFiscal(data: {
  banheiroId: string;
  criterio: string;
  observacoes: string;
  pisoLimpo: boolean;
  vasosHigienizados: boolean;
  piasLimpas: boolean;
  espelhosLimpos: boolean;
  papelHigienico: boolean;
  papelToalha: boolean;
  sabonete: boolean;
  lixeirasLimpas: boolean;
  ambienteSemOdor: boolean;
  portasDivisoriasLimpas: boolean;
}) {
  try {
    const result = await prisma.checklistFiscal.create({
      data: {
        banheiroId: data.banheiroId,
        criterio: data.criterio,
        observacoes: data.observacoes || null,
        pisoLimpo: data.pisoLimpo,
        vasosHigienizados: data.vasosHigienizados,
        piasLimpas: data.piasLimpas,
        espelhosLimpos: data.espelhosLimpos,
        papelHigienico: data.papelHigienico,
        papelToalha: data.papelToalha,
        sabonete: data.sabonete,
        lixeirasLimpas: data.lixeirasLimpas,
        ambienteSemOdor: data.ambienteSemOdor,
        portasDivisoriasLimpas: data.portasDivisoriasLimpas,
      }
    });
    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error saving checklist:", error);
    return { success: false, error: 'Falha ao salvar checklist. Tente novamente.' };
  }
}
