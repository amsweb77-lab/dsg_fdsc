import prisma from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Users, Shield, User, Trash2 } from 'lucide-react'
import { LogoutButton } from '../LogoutButton'
import { createUser, deleteUser } from './actions'

export default async function UsuariosPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Gerenciar Usuários</h1>
            </div>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form to create users */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <h2 className="text-lg font-bold mb-6">Novo Usuário</h2>
            <form action={createUser} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nome</label>
                <input name="name" required className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">E-mail</label>
                <input name="email" type="email" required className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Senha Inicial</label>
                <input name="password" required minLength={6} className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">Nível de Acesso</label>
                <select name="role" className="w-full mt-1 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary appearance-none">
                  <option value="FISCAL">Fiscal</option>
                  <option value="ADMIN">Administrador (Chefe)</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-4 bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-all active:scale-95">
                Cadastrar Usuário
              </button>
            </form>
          </div>
        </div>

        {/* List of users */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold">Equipe Cadastrada ({users.length})</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {users.map(user => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {user.role === 'ADMIN' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {user.role}
                    </span>
                    <form action={deleteUser}>
                      <input type="hidden" name="id" value={user.id} />
                      <button type="submit" className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Excluir">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}
