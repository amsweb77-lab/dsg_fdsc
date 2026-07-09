'use client'

import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function QRCodesPage() {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 print:bg-white print:p-0 flex flex-col items-center justify-center">
      <div className="max-w-xl mx-auto w-full print:max-w-full">
        <header className="flex items-center justify-between mb-8 print:hidden">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">QR Code Geral</h1>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-500 transition-colors active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </header>

        <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center text-center print:shadow-none print:border-none print:rounded-none print:bg-white">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white print:text-black">Avaliação de Banheiros DSG</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg print:text-slate-800">
            Escaneie o código abaixo para acessar o formulário geral de avaliação.
          </p>
          
          <div className="bg-white p-6 rounded-3xl border-4 border-slate-100 dark:border-slate-700 mb-8 shadow-sm print:border-none print:p-0 print:shadow-none">
            {baseUrl && (
              <QRCode
                value={`${baseUrl}/avaliar`}
                size={300}
                level="H"
              />
            )}
          </div>
          
          <p className="text-sm text-slate-400 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-700/50 px-4 py-2 rounded-lg print:text-slate-500 print:bg-transparent print:p-0">
            {baseUrl}/avaliar
          </p>
        </div>
      </div>
    </div>
  );
}
