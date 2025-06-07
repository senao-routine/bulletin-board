// アクティブユーザーの計測機能

interface UserActivity {
  date: string
  users: Set<string>
  visitors: Set<string>
}

// 今日の日付を取得（YYYY-MM-DD形式）
function getTodayKey(): string {
  return new Date().toISOString().split("T")[0]
}

// 今日のアクティビティデータを取得
function getTodayActivity(): UserActivity {
  if (typeof window === "undefined") {
    return { date: getTodayKey(), users: new Set(), visitors: new Set() }
  }

  const today = getTodayKey()
  const stored = localStorage.getItem(`activity-${today}`)

  if (!stored) {
    return { date: today, users: new Set(), visitors: new Set() }
  }

  try {
    const data = JSON.parse(stored)
    return {
      date: today,
      users: new Set(data.users || []),
      visitors: new Set(data.visitors || []),
    }
  } catch (error) {
    console.error("アクティビティデータの解析に失敗しました:", error)
    return { date: today, users: new Set(), visitors: new Set() }
  }
}

// アクティビティデータを保存
function saveActivity(activity: UserActivity): void {
  if (typeof window === "undefined") return

  const data = {
    date: activity.date,
    users: Array.from(activity.users),
    visitors: Array.from(activity.visitors),
  }

  localStorage.setItem(`activity-${activity.date}`, JSON.stringify(data))
}

// ユーザーの投稿アクティビティを記録
export function recordUserActivity(username: string): void {
  const activity = getTodayActivity()
  activity.users.add(username)
  activity.visitors.add(username)
  saveActivity(activity)
}

// 訪問者を記録（匿名ユーザー）
export function recordVisitor(): void {
  const activity = getTodayActivity()

  // ブラウザのフィンガープリントを簡易的に生成
  const fingerprint = generateBrowserFingerprint()
  activity.visitors.add(fingerprint)
  saveActivity(activity)
}

// 今日のアクティブユーザー数を取得
export function getTodayActiveUsers(): number {
  const activity = getTodayActivity()
  return activity.visitors.size
}

// 今日の投稿ユーザー数を取得
export function getTodayPostingUsers(): number {
  const activity = getTodayActivity()
  return activity.users.size
}

// 簡易的なブラウザフィンガープリント生成
function generateBrowserFingerprint(): string {
  if (typeof window === "undefined") return "server"

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  ctx?.fillText("fingerprint", 10, 10)

  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
  ].join("|")

  // 簡易ハッシュ化
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 32bit整数に変換
  }

  return `visitor_${Math.abs(hash)}`
}

// 古いアクティビティデータをクリーンアップ（7日以上前のデータを削除）
export function cleanupOldActivity(): void {
  if (typeof window === "undefined") return

  const today = new Date()
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith("activity-")) {
      const dateStr = key.replace("activity-", "")
      const date = new Date(dateStr)

      if (date < sevenDaysAgo) {
        localStorage.removeItem(key)
      }
    }
  }
}
