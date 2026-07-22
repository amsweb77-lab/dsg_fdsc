import prisma from '@/lib/prisma';
import Link from 'next/link';
import { QrCode, AlertTriangle, CheckCircle, Activity, LayoutDashboard, Clock, ArrowLeft, Users } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import { ChecklistsTable } from './ChecklistsTable';
import { AvaliacoesTable } from './AvaliacoesTable';

export const metadata = {
  title: 'Dashboard Admin | DSG',
};

export default async function AdminDashboard() {
  // Fetch evaluations
  const avaliacoes = await prisma.avaliacao.findMany({
    orderBy: { createdAt: 'desc' },
  });
  
  // Fetch checklists
  const checklists = await prisma.checklistFiscal.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const total = avaliacoes.length;
  const totalChecklists = checklists.length;
  
  const satisfiedLimpeza = avaliacoes.filter(a => a.limpeza === 'SATISFEITO').length;
  const satisfacaoPerc = total > 0 ? Math.round((satisfiedLimpeza / total) * 100) : 0;

  // Recent critical alerts (Last 24h: sem papel, sem sabonete ou NAO_SATISFEITO)
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const alertasCriticos = avaliacoes.filter(a => {
    return a.createdAt >= oneDayAgo && 
           (a.papelHigienico === false || a.saboneteLiquido === false || a.limpeza === 'NAO_SATISFEITO');
  }).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">DSG Painel Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/qrcodes" className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-medium hover:bg-slate-800 transition-all">
              <QrCode className="w-4 h-4" />
              QR Codes
            </Link>
            <Link href="/admin/usuarios" className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-xl font-medium hover:bg-brand-primary/20 transition-all">
              <Users className="w-4 h-4" />
              Usuários
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-brand-primary/10 text-brand-primary rounded-2xl">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Avaliações de Usuários</p>
              <h2 className="text-3xl font-bold">{total}</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Satisfação Geral</p>
              <h2 className="text-3xl font-bold">{satisfacaoPerc}%</h2>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 shadow-sm flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Checklists Encarregados(as)</p>
              <h2 className="text-3xl font-bold text-blue-500">{totalChecklists}</h2>
            </div>
          </div>
        </div>

        {/* Avaliacoes Table */}
        <AvaliacoesTable avaliacoes={avaliacoes} />

        {/* Checklists Fiscais Table */}
        <ChecklistsTable checklists={checklists} />
      </main>
    </div>
  );
}
