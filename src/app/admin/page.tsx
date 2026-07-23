import prisma from '@/lib/prisma';
import Link from 'next/link';
import { QrCode, AlertTriangle, CheckCircle, Activity, LayoutDashboard, Clock, ArrowLeft, Users } from 'lucide-react';
import { LogoutButton } from './LogoutButton';
import { ChecklistsTable } from './ChecklistsTable';
import { AvaliacoesTable } from './AvaliacoesTable';
import { DashboardChart } from './DashboardChart';
import { QualityCharts } from './QualityCharts';

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

  // Generate chart data for the last 7 days
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // Use local date string to avoid timezone shifts
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }).reverse();

  const chartData = last7Days.map(dateStr => {
    const [year, month, day] = dateStr.split('-');
    const displayDate = `${day}/${month}`;
    
    // Filter evaluations matching this date
    const avalDay = avaliacoes.filter(a => {
      const d = new Date(a.createdAt);
      return d.getFullYear() === parseInt(year) && 
             (d.getMonth() + 1) === parseInt(month) && 
             d.getDate() === parseInt(day);
    }).length;
    
    // Filter checklists matching this date
    const checkDay = checklists.filter(c => {
      const d = new Date(c.createdAt);
      return d.getFullYear() === parseInt(year) && 
             (d.getMonth() + 1) === parseInt(month) && 
             d.getDate() === parseInt(day);
    }).length;
    
    return {
      name: displayDate,
      'Avaliações (Público)': avalDay,
      'Checklists (Encarregados)': checkDay
    };
  });

  // Calculate Quality Data
  const publicQualityData = [
    { name: 'Satisfatório', value: avaliacoes.filter(a => a.limpeza === 'SATISFEITO').length, color: '#10b981' },
    { name: 'Parcialmente', value: avaliacoes.filter(a => a.limpeza === 'PARCIALMENTE').length, color: '#f59e0b' },
    { name: 'Inadequada', value: avaliacoes.filter(a => a.limpeza === 'NAO_SATISFEITO').length, color: '#f43f5e' },
  ];

  const fiscalQualityData = [
    { name: 'Atende', value: checklists.filter(c => c.criterio === 'ATENDE').length, color: '#10b981' },
    { name: 'Satisfatório', value: checklists.filter(c => c.criterio === 'SATISFATORIO').length, color: '#f59e0b' },
    { name: 'Não Atende', value: checklists.filter(c => c.criterio === 'NAO_ATENDE').length, color: '#f43f5e' },
  ];

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
            <Link href="/admin/banheiros" className="flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-2 rounded-xl font-medium hover:bg-amber-500/20 transition-all">
              <LayoutDashboard className="w-4 h-4" />
              Banheiros
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

        {/* Chart */}
        <DashboardChart data={chartData} />

        {/* Quality Charts */}
        <QualityCharts publicData={publicQualityData} fiscalData={fiscalQualityData} />

        {/* Avaliacoes Table */}
        <AvaliacoesTable avaliacoes={avaliacoes} />

        {/* Checklists Fiscais Table */}
        <ChecklistsTable checklists={checklists} />
      </main>
    </div>
  );
}
