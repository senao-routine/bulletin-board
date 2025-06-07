// 管理者認証のユーティリティ

// デフォルトの管理者パスワード
const DEFAULT_ADMIN_PASSWORD = "admin123"

// 管理者パスワードを設定
export function setAdminPassword(password: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin-password", password)
  }
}

// 管理者パスワードを取得
export function getAdminPassword(): string {
  if (typeof window === "undefined") {
    return DEFAULT_ADMIN_PASSWORD
  }

  const password = localStorage.getItem("admin-password")
  return password || DEFAULT_ADMIN_PASSWORD
}

// 管理者ログイン状態を確認
export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  return localStorage.getItem("admin-logged-in") === "true"
}

// 管理者ログイン
export function adminLogin(password: string): boolean {
  const correctPassword = getAdminPassword()

  if (password === correctPassword) {
    localStorage.setItem("admin-logged-in", "true")
    return true
  }

  return false
}

// 管理者ログアウト
export function adminLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin-logged-in")
  }
}
