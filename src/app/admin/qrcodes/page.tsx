'use client'

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';



export default function QRCodesPage() {
  const [baseUrl, setBaseUrl] = useState('');
  const [banheirosLista, setBanheirosLista] = useState<{id: string, nome: string}[]>([]);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    fetch('/api/banheiros')
      .then(res => res.json())
      .then(data => setBanheirosLista(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto w-full print:max-w-full">
        <header className="flex items-center justify-between mb-8 print:hidden">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">QR Codes por Banheiro</h1>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-500 transition-colors active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimir Todos
          </button>
        </header>

        {/* Grid for printing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-3 print:gap-4 print:p-4">
          {baseUrl && banheirosLista.map((banheiro, index) => {
            const url = `${baseUrl}/avaliar?id_banheiro=${encodeURIComponent(banheiro.nome)}`;
            return (
              <div 
                key={banheiro.id} 
                className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center print:shadow-none print:border-2 print:border-black print:rounded-2xl print:break-inside-avoid print:p-4"
              >
                <h3 className="font-bold text-sm text-slate-800 dark:text-white mb-4 print:text-black min-h-[40px] flex items-center justify-center leading-tight">
                  {banheiro.nome}
                </h3>
                
                <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 dark:border-slate-700 mb-4 print:border-none print:p-0">
                  <QRCode
                    value={url}
                    size={160}
                    level="H"
                  />
                </div>
                
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono break-all print:text-black">
                  {url}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
