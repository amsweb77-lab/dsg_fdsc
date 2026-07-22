import Link from 'next/link';
import { ClipboardList, LayoutDashboard, ClipboardCheck, LogIn } from 'lucide-react';
import { getSession } from '@/lib/auth';

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-8 text-center border border-slate-100 dark:border-slate-700">
        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <ClipboardList className="w-8 h-8 text-brand-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-4">DSG Avaliações</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Sistema de monitoramento e avaliação em tempo real da limpeza dos banheiros.
        </p>
        <div className="flex flex-col gap-4">
          
          <Link 
            href="/avaliar" 
            className="flex items-center justify-center gap-2 w-full bg-brand-primary/10 text-brand-primary py-4 px-6 rounded-2xl font-medium hover:bg-brand-primary/20 transition-all active:scale-95"
          >
            <ClipboardList className="w-5 h-5" />
            Avaliar Banheiro (Público)
          </Link>

          {session ? (
            <>
              {session.role === 'ADMIN' ? (
                <Link 
                  href="/admin" 
                  className="flex items-center justify-center gap-2 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 px-6 rounded-2xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Painel Administrativo
                </Link>
              ) : (
                <Link 
                  href="/fiscal" 
                  className="flex items-center justify-center gap-2 w-full bg-brand-secondary/10 text-brand-secondary py-4 px-6 rounded-2xl font-medium hover:bg-brand-secondary/20 transition-all active:scale-95"
                >
                  <ClipboardCheck className="w-5 h-5" />
                  Checklist do Fiscal
                </Link>
              )}
            </>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-4 px-6 rounded-2xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all active:scale-95"
            >
              <LogIn className="w-5 h-5" />
              Acesso Restrito
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}
