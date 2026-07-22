'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, ClipboardCheck, MapPin, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { saveChecklistFiscal } from './actions';
import Link from 'next/link';

// List generated from the real 57 bathrooms table
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

const Criterios = [
  { value: 'ATENDE', label: 'Atende', bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', ring: 'ring-emerald-500' },
  { value: 'SATISFATORIO', label: 'Satisfatório', bg: 'bg-amber-500', hover: 'hover:bg-amber-600', ring: 'ring-amber-500' },
  { value: 'NAO_ATENDE', label: 'Não Atende', bg: 'bg-rose-500', hover: 'hover:bg-rose-600', ring: 'ring-rose-500' },
];

const ItensVerificacao = [
  { id: 'pisoLimpo', label: 'Piso limpo e seco' },
  { id: 'vasosHigienizados', label: 'Vasos sanitários higienizados' },
  { id: 'piasLimpas', label: 'Pias limpas' },
  { id: 'espelhosLimpos', label: 'Espelhos limpos' },
  { id: 'papelHigienico', label: 'Papel higiênico abastecido' },
  { id: 'papelToalha', label: 'Papel toalha abastecido' },
  { id: 'sabonete', label: 'Sabonete disponível' },
  { id: 'lixeirasLimpas', label: 'Lixeiras limpas' },
  { id: 'ambienteSemOdor', label: 'Ambiente sem odor' },
  { id: 'portasDivisoriasLimpas', label: 'Portas e divisórias limpas' },
] as const;

export default function ChecklistForm() {
  const searchParams = useSearchParams();
  const idInicial = searchParams.get('id_banheiro');

  const [banheiroId, setBanheiroId] = useState<string>(idInicial || '');
  const [criterio, setCriterio] = useState<string>('');
  const [observacoes, setObservacoes] = useState('');
  
  // Estado para os 10 itens
  const [itens, setItens] = useState<Record<string, boolean | null>>(() => {
    const initialState: Record<string, boolean | null> = {};
    ItensVerificacao.forEach(item => {
      initialState[item.id] = null;
    });
    return initialState;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleItem = (id: string, value: boolean) => {
    setItens(prev => ({ ...prev, [id]: value }));
  };

  // Verificando se tudo foi preenchido
  const isTodosItensPreenchidos = Object.values(itens).every(val => val !== null);
  const isCriterioValido = criterio === 'NAO_ATENDE' ? observacoes.trim().length > 0 : true;
  
  const canSubmit = banheiroId !== '' && criterio !== '' && isTodosItensPreenchidos && isCriterioValido;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsSubmitting(true);
    setError('');
    
    const result = await saveChecklistFiscal({
      banheiroId,
      criterio,
      observacoes,
      pisoLimpo: itens.pisoLimpo as boolean,
      vasosHigienizados: itens.vasosHigienizados as boolean,
      piasLimpas: itens.piasLimpas as boolean,
      espelhosLimpos: itens.espelhosLimpos as boolean,
      papelHigienico: itens.papelHigienico as boolean,
      papelToalha: itens.papelToalha as boolean,
      sabonete: itens.sabonete as boolean,
      lixeirasLimpas: itens.lixeirasLimpas as boolean,
      ambienteSemOdor: itens.ambienteSemOdor as boolean,
      portasDivisoriasLimpas: itens.portasDivisoriasLimpas as boolean,
    });
    
    setIsSubmitting(false);
    
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Ocorreu um erro.');
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto pt-24 px-4 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-primary/20">
          <Check className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Checklist Salvo!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          A vistoria do encarregado(a) foi registrada no sistema com sucesso.
        </p>
        <Link href="/" className="inline-block bg-brand-primary text-white py-4 px-8 rounded-2xl font-semibold active:scale-95 transition-all">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 pt-8">
      <header className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
          <ArrowLeft className="w-4 h-4" />
          Início
        </Link>
      </header>

      <div className="mb-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center mb-4">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Checklist do Encarregado(a)</h1>
        <p className="text-sm text-slate-500">Formulário de vistoria detalhada.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Localização do Banheiro */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <label htmlFor="banheiro-select" className="font-semibold text-lg flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-brand-primary" />
            Localização do Banheiro
          </label>
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
        </section>

        {/* Itens a serem verificados */}
        <section className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-semibold text-lg">ITENS A SEREM VERIFICADOS PELO ENCARREGADO(A)</h3>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {ItensVerificacao.map((item) => (
              <div key={item.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <span className="font-medium text-slate-700 dark:text-slate-300 pr-4">{item.label}</span>
                <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-xl shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id, true)}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all", 
                      itens[item.id] === true ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20" : "text-slate-500"
                    )}
                  >
                    SIM
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id, false)}
                    className={clsx(
                      "px-4 py-2 rounded-lg text-sm font-semibold transition-all", 
                      itens[item.id] === false ? "bg-rose-500 text-white shadow-sm shadow-rose-500/20" : "text-slate-500"
                    )}
                  >
                    NÃO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Critério Avaliado */}
        <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-semibold text-lg mb-6">Critério Avaliado</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {Criterios.map((c) => {
              const isActive = criterio === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCriterio(c.value)}
                  className={clsx(
                    "flex-1 py-4 px-6 rounded-2xl font-bold text-center transition-all active:scale-95 border-2",
                    isActive ? [c.bg, "text-white border-transparent shadow-lg shadow-black/10"] : ["bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400", c.hover]
                  )}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-2">
            <label className="font-semibold text-sm flex items-center justify-between text-slate-700 dark:text-slate-300">
              OBSERVAÇÕES
              {criterio === 'NAO_ATENDE' && <span className="text-rose-500 text-xs bg-rose-50 px-2 py-1 rounded">Obrigatório</span>}
            </label>
            <p className="text-xs text-slate-400 mb-2">(Preencher somente em caso de NÃO ATENDE ou se desejar pontuar algo extra)</p>
            <textarea
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Descreva as irregularidades encontradas..."
              className={clsx(
                "w-full p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl outline-none transition-all resize-none h-24",
                criterio === 'NAO_ATENDE' && observacoes.trim().length === 0 ? "border-rose-500 focus:ring-2 focus:ring-rose-500" : "border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-brand-primary"
              )}
            />
          </div>
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
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-slate-900/30 hover:bg-slate-800 dark:hover:bg-slate-200"
              : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 shadow-none cursor-not-allowed"
          )}
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-4 border-slate-500/30 border-t-slate-500 rounded-full animate-spin"></div>
          ) : (
            'Enviar Checklist do Encarregado(a)'
          )}
        </button>
      </form>
    </div>
  );
}
