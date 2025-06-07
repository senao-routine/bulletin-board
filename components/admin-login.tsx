"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { adminLogin, adminLogout, isAdminLoggedIn } from "@/lib/admin"
import { Lock, LogOut, Shield } from "lucide-react"

interface AdminLoginProps {
  onLoginStatusChange?: (isLoggedIn: boolean) => void
}

export function AdminLogin({ onLoginStatusChange }: AdminLoginProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(isAdminLoggedIn)

  const handleLogin = () => {
    if (adminLogin(password)) {
      setIsLoggedIn(true)
      setIsOpen(false)
      setPassword("")
      setError("")
      if (onLoginStatusChange) {
        onLoginStatusChange(true)
      }
    } else {
      setError("パスワードが正しくありません")
    }
  }

  const handleLogout = () => {
    adminLogout()
    setIsLoggedIn(false)
    if (onLoginStatusChange) {
      onLoginStatusChange(false)
    }
  }

  return (
    <>
      {isLoggedIn ? (
        <div className="flex items-center gap-2 bg-green-900/80 backdrop-blur-md p-2 rounded-lg border-2 border-amber-800 shadow-lg">
          <Badge className="bg-yellow-500 text-green-900 font-semibold">
            <Shield className="h-3 w-3 mr-1" />
            管理者モード
          </Badge>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/10 hover:text-yellow-100">
            <LogOut className="h-4 w-4 mr-1" />
            ログアウト
          </Button>
        </div>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} 
          className="bg-amber-800/80 text-white hover:bg-amber-700 backdrop-blur-md shadow-md border border-amber-700/50 rounded-lg px-4 py-2">
          <Lock className="h-4 w-4 mr-2" />
          管理者ログイン
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] blackboard-bg bg-green-900 border-4 border-amber-800 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white font-chalk text-shadow-chalk">管理者ログイン</DialogTitle>
            <DialogDescription className="text-yellow-chalk font-chalk">管理者機能を使用するにはログインしてください</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white font-chalk">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="管理者パスワードを入力"
                className={`bg-green-950/80 border-white/30 text-white ${error ? "border-red-400" : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleLogin()
                  }
                }}
              />
              {error && <p className="text-sm text-red-300 font-chalk">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}
              className="border-white/30 text-white hover:bg-white/10">
              キャンセル
            </Button>
            <Button onClick={handleLogin} className="bg-yellow-200 hover:bg-yellow-300 text-green-950 font-semibold">
              ログイン
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Badge コンポーネントをインポートし忘れていたので追加
import { Badge } from "@/components/ui/badge"
