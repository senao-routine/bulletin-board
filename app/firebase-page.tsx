"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Header } from "@/components/header"
import { MessageCircle, MessageSquare, Star, User, Calendar, Trash2, AlertTriangle, Eye, Trash } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getPosts, deletePost, deleteAllPosts, type Post } from "@/lib/firebase-posts"
import { AdminLogin } from "@/components/admin-login"
import { isAdminLoggedIn, adminLogin } from "@/lib/admin"

export default function PostListPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false)
  const [deleteAllPassword, setDeleteAllPassword] = useState("")
  const [deleteAllError, setDeleteAllError] = useState("")

  // 投稿データの読み込み
  useEffect(() => {
    setIsAdmin(isAdminLoggedIn())
    
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error("投稿の取得中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase()
  }

  const handleDelete = async (postId: string) => {
    if (!isAdmin) return

    try {
      const success = await deletePost(postId);
      if (success) {
        // 成功したら投稿リストを更新
        const updatedPosts = await getPosts();
        setPosts(updatedPosts);
        setDeleteConfirm(null);
        alert("投稿を削除しました");
      } else {
        alert("投稿の削除に失敗しました");
      }
    } catch (error) {
      console.error("投稿の削除中にエラーが発生しました:", error);
      alert("投稿の削除中にエラーが発生しました");
    }
  }

  const confirmDelete = (postId: string) => {
    if (!isAdmin) return
    setDeleteConfirm(postId)
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
  }

  const handleLoginStatusChange = (loggedIn: boolean) => {
    setIsAdmin(loggedIn)
  }

  const handleDeleteAllPosts = async () => {
    if (!isAdmin) return

    // パスワード確認
    if (!adminLogin(deleteAllPassword)) {
      setDeleteAllError("パスワードが正しくありません")
      return
    }

    // 全削除実行
    try {
      const success = await deleteAllPosts();
      if (success) {
        setPosts([]);
        setShowDeleteAllDialog(false);
        setDeleteAllPassword("");
        setDeleteAllError("");
        alert("すべての投稿を削除しました");
      } else {
        setDeleteAllError("投稿の削除に失敗しました");
      }
    } catch (error) {
      console.error("全投稿の削除中にエラーが発生しました:", error);
      setDeleteAllError("投稿の削除中にエラーが発生しました");
    }
  }

  const openDeleteAllDialog = () => {
    if (!isAdmin) return
    setShowDeleteAllDialog(true)
    setDeleteAllPassword("")
    setDeleteAllError("")
  }

  const closeDeleteAllDialog = () => {
    setShowDeleteAllDialog(false)
    setDeleteAllPassword("")
    setDeleteAllError("")
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

      <Header postCount={posts.length} />

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* 管理者ログインは下部に移動 */}

        {/* 投稿一覧 - 黒板デザイン */}
        <div className="space-y-8">
          <div className="bg-green-900 rounded-t-xl p-6 shadow-xl border-b-8 border-amber-800 relative">
            {/* 黒板の質感エフェクト - 薄い線や斑点 */}
            <div className="absolute inset-0 bg-opacity-10 mix-blend-overlay" 
                 style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                  backgroundSize: '150px 150px'}}></div>
                  
            {/* 黒板のチョークの跡風 */}
            <div className="absolute top-1 left-4 right-4 h-px bg-white/10"></div>
            <div className="absolute bottom-1 left-4 right-4 h-px bg-white/10"></div>
            
            <div className="flex items-center justify-between relative">
              <h2 className="text-4xl font-bold text-white flex items-center gap-3 font-chalk">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                コメント一覧
              </h2>
              <div className="flex items-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm py-2 px-4 rounded-full border border-white/20">
                  <span className="text-lg text-white font-chalk">
                    {posts.length} コメント
                  </span>
                </div>
                {isAdmin && posts.length > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={openDeleteAllDialog}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    全削除
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            {/* 黒板下部の木製フレーム */}
            <div className="absolute -bottom-4 left-0 right-0 h-4 bg-amber-800 rounded-b-xl"></div>
            {/* 黒板の粉受け */}
            <div className="absolute -bottom-2 left-8 right-8 h-2 bg-amber-700"></div>
            {/* チョークとイレイサー */}
            <div className="absolute -bottom-3 right-12 flex items-center gap-3">
              <div className="h-6 w-24 bg-white rounded-sm shadow-md transform rotate-6"></div>
              <div className="h-8 w-4 bg-yellow-200 rounded-sm shadow-md transform -rotate-12"></div>
              <div className="h-8 w-4 bg-pink-200 rounded-sm shadow-md"></div>
            </div>
          </div>

          {loading ? (
            <div className="blackboard-bg bg-green-900 rounded-xl shadow-2xl p-16 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-white text-lg font-chalk">コメントを読み込み中...</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="relative">
              {/* 黒板風の背景 */}
              <div className="blackboard-bg bg-green-900 rounded-xl shadow-2xl pb-10 pt-8 px-8">
                {/* 黒板の質感エフェクト */}
                <div className="absolute inset-0 chalk-dust mix-blend-overlay opacity-30 rounded-xl"></div>
                
                {/* チョークの跡 - 斜線 */}
                <div className="absolute top-6 right-8 w-20 h-1 bg-white/30 transform rotate-12"></div>
                <div className="absolute bottom-10 left-12 w-16 h-1 bg-white/20 transform -rotate-6"></div>
                <div className="absolute top-1/3 left-6 w-24 h-0.5 bg-yellow-200/20 transform -rotate-3"></div>
                <div className="absolute bottom-1/4 right-10 w-28 h-0.5 bg-yellow-100/15 transform rotate-2"></div>
                
                {/* チョークの小さな点々 */}
                <div className="absolute top-20 left-1/4 w-1 h-1 rounded-full bg-white/40"></div>
                <div className="absolute top-12 right-1/3 w-1.5 h-1.5 rounded-full bg-white/30"></div>
                <div className="absolute bottom-32 left-2/3 w-1 h-1 rounded-full bg-yellow-200/40"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="p-6 bg-white/10 rounded-full w-32 h-32 mx-auto flex items-center justify-center relative">
                      <MessageCircle className="h-16 w-16 text-white" />
                      <div className="absolute inset-0 animate-pulse-slow bg-white/5 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="bg-green-950/50 backdrop-blur-sm p-8 rounded-lg max-w-lg mx-auto mb-10 shadow-inner border border-white/10">
                    <p className="text-white mb-8 leading-relaxed text-xl text-center font-chalk text-shadow-chalk">
                      まだコメントがありません。
                      <br />
                      最初のコメントを投稿して、
                      <br />
                      みんなで意見を共有しましょう！
                    </p>
                    
                    <div className="flex justify-center">
                      <Button
                        asChild
                        className="bg-yellow-200 hover:bg-yellow-300 text-yellow-950 font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-lg border-2 border-yellow-100"
                      >
                        <Link href="/new-post">
                          <span className="flex items-center gap-2">
                            <span className="text-xl">✏️</span>
                            <span>最初のコメントを投稿</span>
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* 黒板の木製フレーム */}
                <div className="absolute -bottom-4 left-0 right-0 h-4 bg-amber-800 rounded-b-xl"></div>
                <div className="absolute -bottom-2 left-10 right-10 h-2 bg-amber-700"></div>
                
                {/* 黒板消し */}
                <div className="absolute -bottom-6 right-10 w-20 h-8 bg-slate-600 rounded-sm shadow-md"></div>
                
                {/* チョーク */}
                <div className="absolute -bottom-3 left-1/4 flex items-center gap-2">
                  <div className="h-6 w-16 bg-white rounded-sm shadow-md transform rotate-12"></div>
                  <div className="h-6 w-16 bg-yellow-200 rounded-sm shadow-md transform -rotate-6"></div>
                </div>
              </div>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="mb-6 relative group"
              >
                {/* 付箋のようなデザイン */}
                <div className="absolute -top-3 left-6 w-8 h-8 bg-yellow-300 rounded-md shadow-md transform rotate-6 z-10"></div>
                
                <Card
                  className="shadow-lg border-0 bg-yellow-100 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 border-l-8 border-yellow-300"
                >
                  <CardHeader className="pb-3 pt-5 px-6 bg-yellow-50">
                    <div className="flex items-start gap-5">
                      <div className="flex flex-col items-center gap-2">
                        <div className="ring-2 ring-amber-300 rounded-full shadow-lg">
                          <Avatar className={`h-14 w-14 bg-gradient-to-br from-amber-400 to-amber-500 text-yellow-900 font-bold shadow-inner border-2 border-yellow-200 transform transition-transform duration-300 hover:scale-110`}>
                            <AvatarFallback className={`bg-gradient-to-br from-amber-400 to-amber-500 text-yellow-900`}>
                              {getInitials(post.author)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2 flex items-center gap-2">
                              {post.isPopular && <Star className="h-5 w-5 text-amber-500 fill-current" />}
                              <span className="text-amber-900 font-bold">{post.author}さんのコメント</span>
                              {/* 紙テクスチャのシミュレーション */}
                              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-50 to-amber-50 opacity-30 mix-blend-overlay pointer-events-none"></div>
                            </CardTitle>
                            <div className="flex items-center gap-3 text-sm text-amber-800">
                              <div className="inline-flex items-center gap-1 bg-amber-200/50 px-3 py-1 rounded-full">
                                <Calendar className="h-3 w-3" />
                                <span className="font-medium">{formatDate(post.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {post.isPopular && (
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">人気</Badge>
                            )}
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => confirmDelete(post.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                                title="投稿を削除"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-6 px-6">
                    {/* 黒板を模した見た目 */}
                    <div className="bg-green-950 p-6 rounded-md mb-5 shadow-md relative border border-amber-500">
                      {/* チョークダストのような効果 */}
                      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-20 chalk-dust"></div>
                      
                      {/* チョークの罫線効果 */}
                      <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(255,255,255,0.15) 19px, rgba(255,255,255,0.15) 20px)',
                        backgroundPosition: '0 25px', // 最初の線の位置を調整
                        backgroundSize: '20px 20px',
                      }}></div>
                      
                      {/* チョーク跡の装飾 */}
                      <div className="absolute top-0 left-5 bottom-0 w-0.5 bg-yellow-200/50"></div>
                      
                      {/* チョークの点 */}
                      <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-white/30 rounded-full"></div>
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-white/30 rounded-full"></div>
                      
                      <p className="text-white leading-relaxed whitespace-pre-wrap text-lg relative z-10 pl-8 ml-2 font-chalk text-shadow-chalk">{post.content}</p>
                    </div>

                    {isAdmin && deleteConfirm === post.id && (
                      <Alert className="mb-6 border-2 border-red-300 bg-red-950 backdrop-blur-sm rounded-lg shadow-lg">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <AlertDescription className="text-white">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">この投稿を削除しますか？この操作は取り消せません。</span>
                            <div className="flex gap-2 ml-4">
                              <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} 
                                className="bg-red-600 hover:bg-red-700 rounded-lg shadow-md">
                                削除
                              </Button>
                              <Button variant="outline" size="sm" onClick={cancelDelete}
                                className="border-2 border-white text-white hover:bg-white/10 rounded-lg shadow-sm">
                                キャンセル
                              </Button>
                            </div>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center justify-end pt-3 border-t border-amber-200">
                      {post.isPopular && (
                        <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white animate-pulse-slow">
                          <Star className="h-3 w-3 mr-1 fill-white" /> 人気コメント
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 全削除確認ダイアログ */}
      <Dialog open={showDeleteAllDialog} onOpenChange={setShowDeleteAllDialog}>
        <DialogContent className="sm:max-w-[425px] blackboard-bg bg-green-900 border-amber-800 border-4 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 text-shadow-chalk font-chalk">
              <AlertTriangle className="h-5 w-5 text-red-300" />
              全投稿削除の確認
            </DialogTitle>
            <DialogDescription className="text-yellow-chalk font-chalk">
              <strong>警告：</strong>この操作はすべての投稿を完全に削除します。
              <br />
              この操作は取り消すことができません。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-green-950/80 border border-white/20 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2 font-chalk text-shadow-chalk">削除される内容：</h4>
              <ul className="text-sm text-yellow-chalk space-y-1 font-chalk">
                <li>• 全コメント（{posts.length}件）</li>
                <li>• 投稿者情報</li>
                <li>• 投稿日時</li>
                <li>• 閲覧数データ</li>
              </ul>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delete-password" className="text-sm font-semibold text-white font-chalk">
                管理者パスワードを再入力してください
              </Label>
              <Input
                id="delete-password"
                type="password"
                value={deleteAllPassword}
                onChange={(e) => setDeleteAllPassword(e.target.value)}
                placeholder="パスワードを入力"
                className={`bg-green-950/80 border-white/30 text-white ${deleteAllError ? "border-red-500" : ""}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleDeleteAllPosts()
                  }
                }}
              />
              {deleteAllError && <p className="text-sm text-red-300 font-chalk">{deleteAllError}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteAllDialog}
              className="border-white/30 text-white hover:bg-white/10">
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDeleteAllPosts} className="bg-red-600 hover:bg-red-700">
              <Trash className="h-4 w-4 mr-2" />
              全削除を実行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 管理者ログイン - 右下に固定配置 */}
      <div className="fixed bottom-4 right-4 z-20">
        <AdminLogin onLoginStatusChange={handleLoginStatusChange} />
      </div>
    </div>
  )
}