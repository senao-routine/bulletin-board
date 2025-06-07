"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MessageSquare, Plus, User, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getPosts } from "@/lib/firebase-posts"
import { getTodayActiveUsers, recordVisitor, cleanupOldActivity } from "@/lib/analytics"

interface HeaderProps {
  postCount?: number
}

export function FirebaseHeader({ postCount = 0 }: HeaderProps) {
  const [activeUsers, setActiveUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [postCounts, setPostCounts] = useState(postCount)

  useEffect(() => {
    // ページ訪問を記録
    recordVisitor()

    // アクティブユーザー数を取得
    setActiveUsers(getTodayActiveUsers())

    // 古いデータをクリーンアップ
    cleanupOldActivity()

    // 投稿数を取得（propsで渡されていない場合）
    if (postCount === 0) {
      const fetchPostCount = async () => {
        try {
          const posts = await getPosts();
          setPostCounts(posts.length);
        } catch (error) {
          console.error("投稿の取得中にエラーが発生しました:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchPostCount();
    } else {
      setLoading(false);
    }
  }, [postCount])

  return (
    <div className="blackboard-bg bg-green-900 border-b-8 border-amber-800 text-white shadow-2xl relative">
      {/* 黒板の質感エフェクト */}
      <div className="absolute inset-0 chalk-dust mix-blend-overlay opacity-30"></div>
      
      {/* チョークの跡 - 上部装飾 */}
      <div className="absolute top-4 left-8 w-32 h-1 bg-white/20 transform -rotate-3"></div>
      <div className="absolute top-6 right-12 w-24 h-1 bg-white/15 transform rotate-2"></div>
      
      {/* チョークのドット */}
      <div className="absolute top-5 left-1/4 w-1.5 h-1.5 rounded-full bg-white/30"></div>
      <div className="absolute top-8 right-1/3 w-1 h-1 rounded-full bg-white/40"></div>
      
      <div className="container mx-auto px-6 py-10 relative z-10">
        <div className="text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-5">
            <div className="p-4 bg-white/15 rounded-full shadow-inner border border-white/10">
              <MessageSquare className="h-10 w-10 text-white text-shadow-chalk" />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white text-shadow-chalk font-chalk">
                花園ジャパンツアー ✕ 生成AI授業
              </h1>
              <div className="text-xl md:text-2xl mt-2 font-medium text-white/90 font-chalk">
                振り返りコメントフォーム
              </div>
            </div>
          </div>
          
          <p className="text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-chalk text-shadow-chalk">
            今日の授業の感想・考えたことなどを投稿しましょう
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-5 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-950/60 rounded-full border border-white/20">
              <User className="h-4 w-4 text-white" />
              <span className="text-white font-chalk">
                総投稿数: <span className="font-bold text-yellow-chalk">
                  {loading ? "読み込み中..." : postCounts}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-950/60 rounded-full border border-white/20">
              <TrendingUp className="h-4 w-4 text-white" />
              <span className="text-white font-chalk">今日のアクティブユーザー: <span className="font-bold text-yellow-chalk">{activeUsers}</span></span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center mt-8 gap-5">
            <Button asChild className="bg-amber-800 hover:bg-amber-700 shadow-lg border-2 border-amber-700/70 rounded-xl px-6 py-5 text-base font-chalk">
              <Link href="/">
                <MessageSquare className="h-5 w-5 mr-2" />
                コメント一覧
              </Link>
            </Button>
            <Button asChild className="bg-yellow-200 hover:bg-yellow-300 text-green-900 shadow-lg rounded-xl px-6 py-5 text-base font-semibold">
              <Link href="/new-post">
                <Plus className="h-5 w-5 mr-2" />
                新規コメント
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* 黒板下部の木製フレーム */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-amber-700"></div>
      
      {/* チョーク */}
      <div className="absolute bottom-0 left-8 transform translate-y-1/2">
        <div className="h-6 w-12 bg-white rounded-sm shadow-md transform rotate-12"></div>
      </div>
      <div className="absolute bottom-0 right-10 transform translate-y-1/2">
        <div className="h-6 w-14 bg-yellow-200 rounded-sm shadow-md transform -rotate-6"></div>
      </div>
    </div>
  )
}