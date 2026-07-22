'use client'
import { LogOut } from 'lucide-react'
import { logoutAction } from '@/app/login/actions'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  return (
    <button 
      onClick={async () => {
        await logoutAction()
        router.push('/')
      }}
      className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
      title="Sair do sistema"
    >
      <LogOut className="w-5 h-5" />
    </button>
  )
}
