'use client'

import { useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { updateUser } from './actions'

type User = {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'FISCAL'
}

export function EditUserModal({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', user.id)
    
    const result = await updateUser(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    } else {
      setIsOpen(false)
      setIsPending(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" 
        title="Editar Usuário"
      >
        <Pencil className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl w-full max-w-md border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Editar Usuário</h2>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium text-center">
                  {error}
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nome</label>
                <input name="name" defaultValue={user.name || ''} required className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">E-mail</label>
                <input name="email" type="email" defaultValue={user.email} required className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nova Senha (opcional)</label>
                <input name="password" placeholder="Deixe em branco para não alterar" minLength={6} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nível de Acesso</label>
                <select name="role" defaultValue={user.role} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary appearance-none">
                  <option value="FISCAL">Encarregado(a)</option>
                  <option value="ADMIN">Administrador (Chefe)</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 p-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isPending} className="flex-1 bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-70">
                  {isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
