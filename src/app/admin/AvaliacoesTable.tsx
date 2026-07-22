'use client';

import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';

export function AvaliacoesTable({ avaliacoes }: { avaliacoes: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <h3 className="text-lg font-bold">Avaliações de Usuários (Recentes)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm border-b border-slate-100 dark:border-slate-700">
              <th className="p-4 font-semibold">Data/Hora</th>
              <th className="p-4 font-semibold">Banheiro</th>
              <th className="p-4 font-semibold">Limpeza</th>
              <th className="p-4 font-semibold">Insumos</th>
              <th className="p-4 font-semibold">Obs</th>
              <th className="p-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  Nenhuma avaliação registrada ainda.
                </td>
              </tr>
            ) : (
              avaliacoes.slice(0, 50).map((a) => {
                const isExpanded = expandedId === a.id;
                return (
                  <React.Fragment key={a.id}>
                    <tr 
                      onClick={() => toggleRow(a.id)}
                      className={`border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-pointer select-none ${isExpanded ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                    >
                      <td className="p-4 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {new Date(a.createdAt).toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{a.banheiroId}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          a.limpeza === 'SATISFEITO' ? 'bg-emerald-100 text-emerald-700' : 
                          a.limpeza === 'PARCIALMENTE' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {a.limpeza}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {!a.papelHigienico && <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold" title="Sem Papel">SP</span>}
                          {!a.saboneteLiquido && <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-bold" title="Sem Sabonete">SS</span>}
                          {a.papelHigienico && a.saboneteLiquido && <span className="text-slate-400 text-xs font-semibold">OK</span>}
                        </div>
                      </td>
                      <td className="p-4 text-sm max-w-[150px] truncate text-slate-500" title={a.observacoes || ''}>
                        {a.observacoes || '-'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full inline-flex transition-colors">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                        <td colSpan={6} className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl mx-auto bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                            
                            <div className="space-y-4">
                              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Detalhes da Avaliação</h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <p className="text-xs text-slate-500 mb-1">Conservação Geral</p>
                                  <span className={`font-semibold text-sm ${
                                    a.conservacao === 'SATISFEITO' ? 'text-emerald-600' : 
                                    a.conservacao === 'PARCIALMENTE' ? 'text-amber-600' : 'text-rose-600'
                                  }`}>
                                    {a.conservacao === 'SATISFEITO' ? 'Satisfatória' : a.conservacao === 'PARCIALMENTE' ? 'Parcialmente' : 'Inadequada'}
                                  </span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                  <p className="text-xs text-slate-500 mb-1">Limpeza</p>
                                  <span className={`font-semibold text-sm ${
                                    a.limpeza === 'SATISFEITO' ? 'text-emerald-600' : 
                                    a.limpeza === 'PARCIALMENTE' ? 'text-amber-600' : 'text-rose-600'
                                  }`}>
                                    {a.limpeza === 'SATISFEITO' ? 'Satisfatória' : a.limpeza === 'PARCIALMENTE' ? 'Parcialmente' : 'Inadequada'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">Insumos</h4>
                              
                              <div className="space-y-2">
                                <Item label="Papel Higiênico" ok={a.papelHigienico} />
                                <Item label="Sabonete Líquido" ok={a.saboneteLiquido} />
                              </div>
                            </div>

                            {a.observacoes && (
                              <div className="col-span-1 md:col-span-2 mt-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="font-semibold text-xs text-slate-400 dark:text-slate-500 mb-3 uppercase tracking-wider">Comentário do Usuário</h4>
                                <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">{a.observacoes}</p>
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
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md"><CheckCircle2 className="w-4 h-4" /> DISPONÍVEL</span>
      ) : (
        <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md"><XCircle className="w-4 h-4" /> EM FALTA</span>
      )}
    </div>
  );
}
