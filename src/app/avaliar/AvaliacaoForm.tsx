'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Smile, Meh, Frown, Check, Info, Droplet, ArchiveX, MapPin, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { saveAvaliacao } from './actions';
import Link from 'next/link';

type Nivel = 'SATISFEITO' | 'PARCIALMENTE' | 'NAO_SATISFEITO';

const Niveis = [
  { value: 'SATISFEITO', label: 'Bom', icon: Smile, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500', active: 'bg-emerald-500 text-white' },
  { value: 'PARCIALMENTE', label: 'Razoável', icon: Meh, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500', active: 'bg-amber-500 text-white' },
  { value: 'NAO_SATISFEITO', label: 'Ruim', icon: Frown, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500', active: 'bg-rose-500 text-white' },
];

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

// Gera exatamente as 57 localizações com base na tabela real
const BANHEIROS_LISTA = BANHEIROS_DATA.flatMap(b => 
  TIPOS.map(tipo => `${b.local} | ${b.andar} | Ala ${b.ala} | ${tipo}`)
);

export default function AvaliacaoForm() {
  const searchParams = useSearchParams();
  const idInicial = searchParams.get('id_banheiro');

  const [banheiroId, setBanheiroId] = useState<string>(idInicial || '');
  const [limpeza, setLimpeza] = useState<Nivel | null>(null);
  const [papelHigienico, setPapelHigienico] = useState<boolean | null>(null);
  const [saboneteLiquido, setSaboneteLiquido] = useState<boolean | null>(null);
  const [conservacao, setConservacao] = useState<Nivel | null>(null);
  const [observacoes, setObservacoes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [currentPeriodName, setCurrentPeriodName] = useState('');

  const getCurrentPeriod = () => {
    const hours = new Date().getHours();
    return hours < 12 ? 'manhã' : 'tarde/noite';
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Check if already evaluated
  useEffect(() => {
    if (!banheiroId) {
      setHasEvaluated(false);
      return;
    }
    
    const period = getCurrentPeriod();
    setCurrentPeriodName(period);
    
    const saved = localStorage.getItem('avaliacoes_realizadas_v2');
    if (saved) {
      try {
        const avaliacoes = JSON.parse(saved) as { id: string, date: string, period: string }[];
        const today = getCurrentDate();
        
        const alreadyEvaluated = avaliacoes.some(a => 
          a.id === banheiroId && a.date === today && a.period === period
        );
        
        setHasEvaluated(alreadyEvaluated);
      } catch (e) {
        setHasEvaluated(false);
      }
    } else {
      setHasEvaluated(false);
    }
  }, [banheiroId]);

  const canSubmit = banheiroId !== '' && limpeza && papelHigienico !== null && saboneteLiquido !== null && conservacao && !hasEvaluated;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    setError('');
    
    const result = await saveAvaliacao({
      banheiroId,
      limpeza,
      papelHigienico,
      saboneteLiquido,
      conservacao,
      observacoes
    });
    
    setIsSubmitting(false);
    
    if (result.success) {
      // Save to localStorage to block future evaluations for this bathroom in this period
      const saved = localStorage.getItem('avaliacoes_realizadas_v2');
      let avaliacoes = saved ? JSON.parse(saved) : [];
      
      const today = getCurrentDate();
      const period = getCurrentPeriod();
      
      // Filter out old dates to keep localStorage small
      avaliacoes = avaliacoes.filter((a: any) => a.date === today);
      
      avaliacoes.push({
        id: banheiroId,
        date: today,
        period: period
      });
      
      localStorage.setItem('avaliacoes_realizadas_v2', JSON.stringify(avaliacoes));
      setSubmitted(true);
    } else {
      setError(result.error || 'Ocorreu um erro.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto pt-24 px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
          <Check className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Obrigado!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Sua avaliação foi registrada com sucesso e ajudará a Diretoria de Serviços Gerais a manter este ambiente limpo. Você pode fechar esta tela.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pt-8">
      {!idInicial && (
        <header className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <ArrowLeft className="w-4 h-4" />
            Início
          </Link>
        </header>
      )}

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Avaliação do Banheiro</h1>
        <p className="text-sm text-slate-500">Por favor, selecione o local e avalie.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Localização do Banheiro */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <label htmlFor="banheiro-select" className="font-semibold text-lg flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-brand-primary" />
            Localização do Banheiro
          </label>
          {idInicial ? (
            <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl px-4 py-4 font-medium opacity-80 cursor-not-allowed text-sm sm:text-base">
              {banheiroId}
            </div>
          ) : (
            <select 
              id="banheiro-select"
              value={banheiroId}
              onChange={(e) => setBanheiroId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-brand-primary transition-all appearance-none"
            >
              <option value="" disabled>Selecione um banheiro...</option>
              {BANHEIROS_LISTA.map(nome => (
                <option key={nome} value={nome}>{nome}</option>
              ))}
            </select>
          )}
        </section>

        {hasEvaluated ? (
          <div className="bg-amber-50 border-2 border-amber-200 text-amber-700 p-8 rounded-3xl text-center shadow-sm animate-in fade-in zoom-in">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Já Avaliado</h3>
            <p className="text-sm font-medium">
              Você já enviou uma avaliação para este banheiro no período da {currentPeriodName}. Agradecemos sua colaboração e volte no próximo turno!
            </p>
          </div>
        ) : (
          <>

        {/* Limpeza Geral */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Como você avalia a <span className="text-brand-primary">limpeza geral</span>?
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {Niveis.map((n) => {
              const isActive = limpeza === n.value;
              return (
                <button
                  key={n.value}
                  type="button"
                  onClick={() => setLimpeza(n.value as Nivel)}
                  className={clsx(
                    "flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-200 border-2 active:scale-95",
                    isActive ? [n.active, n.border] : ["border-transparent", n.bg, n.color, "hover:brightness-95"]
                  )}
                >
                  <n.icon className={clsx("w-8 h-8 mb-2", isActive && "text-white")} />
                  <span className={clsx("text-xs font-semibold", isActive && "text-white")}>{n.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Insumos */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
          <h3 className="font-semibold text-lg mb-2">Insumos disponíveis</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">
                <ArchiveX className="w-5 h-5" />
              </div>
              <span className="font-medium">Papel Higiênico</span>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPapelHigienico(true)}
                className={clsx("px-4 py-2 rounded-lg text-sm font-semibold transition-all", papelHigienico === true ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500")}
              >
                SIM
              </button>
              <button
                type="button"
                onClick={() => setPapelHigienico(false)}
                className={clsx("px-4 py-2 rounded-lg text-sm font-semibold transition-all", papelHigienico === false ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20" : "text-slate-500")}
              >
                NÃO
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500">
                <Droplet className="w-5 h-5" />
              </div>
              <span className="font-medium">Sabonete Líquido</span>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSaboneteLiquido(true)}
                className={clsx("px-4 py-2 rounded-lg text-sm font-semibold transition-all", saboneteLiquido === true ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500")}
              >
                SIM
              </button>
              <button
                type="button"
                onClick={() => setSaboneteLiquido(false)}
                className={clsx("px-4 py-2 rounded-lg text-sm font-semibold transition-all", saboneteLiquido === false ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20" : "text-slate-500")}
              >
                NÃO
              </button>
            </div>
          </div>
        </section>

        {/* Conservacao */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            Como você avalia a <span className="text-brand-secondary">conservação</span>?
          </h3>
          <p className="text-xs text-slate-400 mb-4">(Portas, torneiras, pias, lixeiras)</p>
          <div className="grid grid-cols-3 gap-3">
            {Niveis.map((n) => {
              const isActive = conservacao === n.value;
              return (
                <button
                  key={n.value}
                  type="button"
                  onClick={() => setConservacao(n.value as Nivel)}
                  className={clsx(
                    "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 border-2 active:scale-95",
                    isActive ? [n.active, n.border] : ["border-transparent", n.bg, n.color, "hover:brightness-95"]
                  )}
                >
                  <span className={clsx("text-xs font-semibold", isActive && "text-white")}>{n.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Observações */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Info className="w-5 h-5 text-slate-400" />
            Observações (Opcional)
          </h3>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: Torneira vazando, porta emperrada..."
            className="w-full mt-2 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none h-24"
          />
        </section>

        {error && (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-center text-sm font-medium border border-rose-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className={clsx(
            "w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center mb-8",
            canSubmit && !isSubmitting
              ? "bg-brand-primary text-white shadow-brand-primary/30 hover:bg-indigo-500"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 shadow-none cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            'Enviar Avaliação'
          )}
        </button>
        </>
        )}
      </form>
    </div>
  );
}
