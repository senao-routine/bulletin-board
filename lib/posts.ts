import { recordUserActivity } from "./analytics"

export interface Post {
  id: number
  title: string
  content: string
  author: string
  createdAt: Date
  replies?: number
  views?: number
  isPopular?: boolean
}

// ローカルストレージから投稿を取得
export function getPosts(): Post[] {
  if (typeof window === "undefined") {
    return getDefaultPosts()
  }

  const posts = localStorage.getItem("bulletin-board-posts")
  if (!posts) {
    const defaultPosts = getDefaultPosts()
    localStorage.setItem("bulletin-board-posts", JSON.stringify(defaultPosts))
    return defaultPosts
  }

  try {
    // 日付文字列をDateオブジェクトに変換
    return JSON.parse(posts, (key, value) => {
      if (key === "createdAt") {
        return new Date(value)
      }
      return value
    })
  } catch (error) {
    console.error("投稿データの解析に失敗しました:", error)
    return getDefaultPosts()
  }
}

// 投稿を保存
export function savePosts(posts: Post[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("bulletin-board-posts", JSON.stringify(posts))
  }
}

// 新しい投稿を追加
export function addPost(post: Omit<Post, "id" | "createdAt">): Post {
  const posts = getPosts()

  const newPost: Post = {
    ...post,
    id: Date.now(),
    createdAt: new Date(),
    replies: 0,
    views: 1,
  }

  const updatedPosts = [newPost, ...posts]
  savePosts(updatedPosts)

  // ユーザーアクティビティを記録
  recordUserActivity(post.author)

  return newPost
}

// 投稿を削除
export function deletePost(postId: number): void {
  const posts = getPosts()
  const updatedPosts = posts.filter((post) => post.id !== postId)
  savePosts(updatedPosts)
}

// 全投稿を削除（管理者専用）
export function deleteAllPosts(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("bulletin-board-posts", JSON.stringify([]))
  }
}

// デフォルトの投稿データ
export function getDefaultPosts(): Post[] {
  return []
}
