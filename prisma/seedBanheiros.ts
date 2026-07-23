import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function main() {
  console.log('Iniciando seed de Banheiros...');
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
  console.log(`Seed concluído. ${inseridos} banheiros inseridos.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
