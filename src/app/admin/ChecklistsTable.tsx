'use client';

import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';

export function ChecklistsTable({ checklists }: { checklists: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="text-lg font-bold">Checklists Encarregados(as) (Recentes)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm border-b border-slate-100 dark:border-slate-700">
              <th className="p-4 font-semibold">Data/Hora</th>
              <th className="p-4 font-semibold">Encarregado(a)</th>
              <th className="p-4 font-semibold">Banheiro</th>
              <th className="p-4 font-semibold">Critério</th>
              <th className="p-4 font-semibold">Itens OK/Total</th>
              <th className="p-4 font-semibold">Obs</th>
              <th className="p-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {checklists.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  Nenhum checklist registrado ainda.
                </td>
              </tr>
            ) : (
              checklists.slice(0, 50).map((c) => {
                const totalItens = 10;
                const itensOk = [c.pisoLimpo, c.vasosHigienizados, c.piasLimpas, c.espelhosLimpos, c.papelHigienico, c.papelToalha, c.sabonete, c.lixeirasLimpas, c.ambienteSemOdor, c.portasDivisoriasLimpas].filter(Boolean).length;
                const isExpanded = expandedId === c.id;
                
                return (
                  <React.Fragment key={c.id}>
                    <tr 
                      onClick={() => toggleRow(c.id)}
                      className={`border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer select-none ${isExpanded ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                    >
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {new Date(c.createdAt).toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-slate-700 dark:text-slate-300">
                        {c.userName || 'Sistema'}
                      </td>
                      <td className="p-4 font-medium">{c.banheiroId}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                          c.criterio === 'ATENDE' ? 'bg-emerald-500' : 
                          c.criterio === 'SATISFATORIO' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}>
                          {c.criterio}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`font-mono text-sm ${itensOk === totalItens ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {itensOk}/{totalItens}
                        </span>
                      </td>
                      <td className="p-4 text-sm max-w-[150px] truncate text-slate-500" title={c.observacoes || ''}>
                        {c.observacoes || '-'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full inline-flex transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                        <td colSpan={7} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <div className="space-y-3">
                              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">Itens Avaliados (1-5)</h4>
                              <Item label="Piso limpo e seco" ok={c.pisoLimpo} />
                              <Item label="Vasos sanitários higienizados" ok={c.vasosHigienizados} />
                              <Item label="Pias limpas" ok={c.piasLimpas} />
                              <Item label="Espelhos limpos" ok={c.espelhosLimpos} />
                              <Item label="Papel higiênico" ok={c.papelHigienico} />
                            </div>
                            <div className="space-y-3">
                              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-wider">Itens Avaliados (6-10)</h4>
                              <Item label="Papel toalha" ok={c.papelToalha} />
                              <Item label="Sabonete" ok={c.sabonete} />
                              <Item label="Lixeiras limpas" ok={c.lixeirasLimpas} />
                              <Item label="Ambiente sem odor" ok={c.ambienteSemOdor} />
                              <Item label="Portas e divisórias limpas" ok={c.portasDivisoriasLimpas} />
                            </div>
                            {c.observacoes && (
                              <div className="col-span-1 md:col-span-2 mt-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">Observações Detalhadas do Encarregado(a)</h4>
                                <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">{c.observacoes}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Item({ label, ok }: { label: string, ok: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
      {ok ? (
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md"><CheckCircle2 className="w-4 h-4" /> SIM</span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md"><XCircle className="w-4 h-4" /> NÃO</span>
      )}
    </div>
  );
}
