import { Suspense } from 'react';
import ChecklistForm from './ChecklistForm';

export const metadata = {
  title: 'Checklist do Encarregado(a) | DSG',
};

export default function FiscalPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8">
      <Suspense fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
            <div className="text-slate-400">Carregando formulário...</div>
          </div>
        </div>
      }>
        <ChecklistForm />
      </Suspense>
    </main>
  );
}
