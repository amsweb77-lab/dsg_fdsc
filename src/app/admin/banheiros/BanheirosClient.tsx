'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, MapPin, Loader2 } from 'lucide-react';

type Banheiro = {
  id: string;
  nome: string;
  createdAt: string;
};

export default function BanheirosClient() {
  const [banheiros, setBanheiros] = useState<Banheiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [nomeForm, setNomeForm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBanheiros();
  }, []);

  const fetchBanheiros = async () => {
    try {
      const res = await fetch('/api/banheiros');
      const data = await res.json();
      setBanheiros(data);
    } catch (error) {
      console.error('Erro ao buscar banheiros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banheiro?: Banheiro) => {
    if (banheiro) {
      setEditId(banheiro.id);
      setNomeForm(banheiro.nome);
    } else {
      setEditId(null);
      setNomeForm('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setNomeForm('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeForm.trim()) return;

    setIsSaving(true);
    try {
      if (editId) {
        await fetch(`/api/banheiros/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: nomeForm }),
        });
      } else {
        await fetch('/api/banheiros', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: nomeForm }),
        });
      }
      await fetchBanheiros();
      handleCloseModal();
    } catch (error) {
      console.error('Erro ao salvar banheiro:', error);
      alert('Ocorreu um erro ao salvar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta localização? (Pode afetar relatórios antigos)')) return;

    try {
      await fetch(`/api/banheiros/${id}`, { method: 'DELETE' });
      await fetchBanheiros();
    } catch (error) {
      console.error('Erro ao excluir banheiro:', error);
      alert('Erro ao excluir banheiro.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pt-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-primary" />
            Gerenciar Banheiros
          </h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-xl transition-all font-medium"
        >
          <Plus className="w-5 h-5" />
          Novo Banheiro
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Localização</th>
                <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 w-32 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {banheiros.map((banheiro) => (
                <tr key={banheiro.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                    {banheiro.nome}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(banheiro)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(banheiro.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {banheiros.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                    Nenhum banheiro cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {editId ? 'Editar Banheiro' : 'Novo Banheiro'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                  Nome / Localização Completa
                </label>
                <input 
                  type="text" 
                  value={nomeForm}
                  onChange={(e) => setNomeForm(e.target.value)}
                  placeholder="Ex: Anexo | Térreo | Ala 6 | PCD"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-primary"
                  autoFocus
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Esta string será usada nos formulários e QR Codes. Siga o padrão atual se desejar manter a consistência.
                </p>
              </div>
              <div className="flex gap-3 justify-end mt-8">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving || !nomeForm.trim()}
                  className="px-4 py-2 font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
