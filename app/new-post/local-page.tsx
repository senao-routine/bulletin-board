"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { Plus, User, MessageSquare } from "lucide-react"
import { addPost, getPosts } from "@/lib/posts"

export default function NewPostPage() {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim() || !author.trim()) {
      alert("すべての項目を入力してください")
      return
    }

    setIsSubmitting(true)

    try {
      // 新しい投稿を追加
      addPost({
        title: "コメント", // タイトルは固定値を使用
        content: content.trim(),
        author: author.trim(),
      })

      // 成功メッセージ
      alert("投稿が完了しました！")

      // 投稿一覧ページにリダイレクト
      router.push("/")
    } catch (error) {
      console.error("投稿の保存中にエラーが発生しました:", error)
      alert("投稿の保存中にエラーが発生しました。もう一度お試しください。")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 relative overflow-hidden">
      {/* 学校風背景 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-amber-50">
        {/* 校舎風の背景パターン */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(251, 243, 219, 0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 243, 219, 0.8) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* 薄い木目調テクスチャ */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z\' fill=\'%23D97706\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
        }}></div>
      </div>

      <Header postCount={getPosts().length} />

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* コミュニティルール - 黒板スタイル */}
        <div className="mb-8 blackboard-bg bg-green-900 rounded-xl shadow-2xl p-6 relative border-4 border-amber-800">
          {/* 黒板の質感エフェクト */}
          <div className="absolute inset-0 chalk-dust mix-blend-overlay opacity-30 rounded-xl"></div>
          
          {/* チョークの跡 - 装飾 */}
          <div className="absolute top-6 right-8 w-20 h-1 bg-white/30 transform rotate-12"></div>
          <div className="absolute bottom-10 left-12 w-16 h-1 bg-white/20 transform -rotate-6"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-full shadow-inner border border-white/30">
                <span className="text-xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-white font-chalk text-shadow-chalk">コミュニティルール</h3>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-green-950/50 border border-white/20 transform transition-all duration-200">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-200/20 rounded-full shadow-inner">
                  <span>🤝</span>
                </div>
                <span className="text-white font-chalk font-medium text-shadow-chalk">他の人を尊重しましょう</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-green-950/50 border border-white/20 transform transition-all duration-200">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-200/20 rounded-full shadow-inner">
                  <span>💬</span>
                </div>
                <span className="text-white font-chalk font-medium text-shadow-chalk">建設的な意見を心がけましょう</span>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-lg bg-green-950/50 border border-white/20 transform transition-all duration-200">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-200/20 rounded-full shadow-inner">
                  <span>🛡️</span>
                </div>
                <span className="text-white font-chalk font-medium text-shadow-chalk">個人情報は投稿しないでください</span>
              </div>
            </div>
          </div>
          
          {/* 黒板下部の木製フレーム */}
          <div className="absolute -bottom-4 left-0 right-0 h-4 bg-amber-800 rounded-b-xl"></div>
          <div className="absolute -bottom-2 left-10 right-10 h-2 bg-amber-700"></div>
        </div>

        {/* 投稿フォーム - 黒板スタイル */}
        <div className="blackboard-bg bg-green-900 rounded-xl shadow-2xl overflow-hidden relative border-4 border-amber-800">
          {/* 黒板ヘッダー */}
          <div className="relative p-8 border-b border-white/10">
            {/* 黒板の質感エフェクト */}
            <div className="absolute inset-0 chalk-dust mix-blend-overlay opacity-30"></div>
            
            {/* チョークの跡 - 装飾 */}
            <div className="absolute top-6 right-8 w-20 h-1 bg-white/20 transform rotate-12"></div>
            <div className="absolute bottom-4 left-12 w-16 h-1 bg-white/15 transform -rotate-6"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-3 bg-white/15 rounded-full shadow-inner border border-white/20">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-chalk text-shadow-chalk">コメントを投稿する</h2>
                <p className="text-white/90 text-lg mt-2 font-chalk">授業に関する感想や考えを共有しましょう</p>
              </div>
            </div>
          </div>
          
          {/* フォーム部分 */}
          <div className="p-8 relative">
            {/* 黒板の質感エフェクト */}
            <div className="absolute inset-0 chalk-dust mix-blend-overlay opacity-20"></div>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              {/* ユーザー名 */}
              <div className="space-y-3 bg-green-950/50 p-6 rounded-xl border border-white/20 shadow-inner">
                <Label htmlFor="author" className="text-base font-semibold text-white font-chalk flex items-center gap-2 text-shadow-chalk">
                  <User className="h-4 w-4 text-white" />
                  ユーザー名
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="あなたのニックネーム"
                  className="bg-green-950/30 border-white/30 text-white py-6 text-lg shadow-inner focus:ring-2 focus:ring-yellow-200/30 focus:border-yellow-200/50 placeholder:text-white/50"
                  required
                />
              </div>
              
              {/* 投稿内容 */}
              <div className="space-y-3 bg-green-950/50 p-6 rounded-xl border border-white/20 shadow-inner">
                <Label htmlFor="content" className="text-base font-semibold text-white font-chalk flex items-center gap-2 text-shadow-chalk">
                  <MessageSquare className="h-4 w-4 text-white" />
                  投稿内容
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="今日の授業の感想や考えを自由に共有してください！"
                  rows={8}
                  className="bg-green-950/30 border-white/30 text-white text-lg shadow-inner resize-none focus:ring-2 focus:ring-yellow-200/30 focus:border-yellow-200/50 placeholder:text-white/50"
                  required
                />
              </div>
              
              {/* ボタン */}
              <div className="flex gap-5 justify-end mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push("/")} 
                  className="px-7 py-6 rounded-xl text-yellow-200 border-2 border-yellow-200/50 bg-green-950/50 hover:bg-green-950/80 hover:border-yellow-200/70 transition-all font-chalk"
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  className="bg-yellow-200 hover:bg-yellow-300 text-green-900 font-bold py-6 px-10 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-green-900 border-t-transparent rounded-full"></div>
                      <span>投稿中...</span>
                    </div> : 
                    <div className="flex items-center gap-2">
                      <span className="text-lg">✏️</span>
                      <span>コメントを投稿</span>
                    </div>
                  }
                </Button>
              </div>
            </form>
          </div>
          
          {/* 黒板下部の木製フレーム */}
          <div className="absolute -bottom-4 left-0 right-0 h-4 bg-amber-800 rounded-b-xl"></div>
          <div className="absolute -bottom-2 left-10 right-10 h-2 bg-amber-700"></div>
        </div>
      </div>
    </div>
  )
}
