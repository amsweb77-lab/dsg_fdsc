import { Suspense } from 'react';
import AvaliacaoForm from './AvaliacaoForm';

export const metadata = {
  title: 'Avaliar Banheiro | DSG',
};

export default function AvaliarPage() {
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
        <AvaliacaoForm />
      </Suspense>
    </main>
  );
}
