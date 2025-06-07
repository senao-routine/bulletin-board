import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { db } from "./firebase";
import { recordUserActivity } from "./analytics";

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  views?: number;
  isPopular?: boolean;
}

// リアルタイムでの投稿監視（リスナー）
export function subscribeToPostsUpdates(
  onUpdate: (posts: Post[]) => void, 
  onError: (error: Error) => void
): () => void {
  const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  
  // onSnapshotはリスナーを返す
  const unsubscribe = onSnapshot(
    postsQuery,
    (snapshot) => {
      const postsData = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Firestoreのタイムスタンプを日付に変換
        const createdAt = data.createdAt instanceof Timestamp 
          ? data.createdAt.toDate() 
          : new Date(data.createdAt);
        
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          author: data.author,
          createdAt,
          views: data.views || 0,
          isPopular: data.isPopular || false
        } as Post;
      });
      
      onUpdate(postsData);
    },
    onError
  );
  
  // コンポーネントのアンマウント時にリスナーを解除するための関数を返す
  return unsubscribe;
}

// 一度限りの投稿取得（バックアップとして残す）
export async function getPosts(): Promise<Post[]> {
  try {
    const postsQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(postsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Firestoreのタイムスタンプを日付に変換
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date(data.createdAt);
      
      return {
        id: doc.id,
        title: data.title,
        content: data.content,
        author: data.author,
        createdAt,
        views: data.views || 0,
        isPopular: data.isPopular || false
      } as Post;
    });
  } catch (error) {
    console.error("投稿の取得に失敗しました:", error);
    return [];
  }
}

// 新しい投稿を追加
export async function addPost(post: Omit<Post, "id" | "createdAt">): Promise<Post | null> {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...post,
      createdAt: serverTimestamp(),
      views: 1,
      isPopular: false
    });
    
    // ユーザーアクティビティを記録
    recordUserActivity(post.author);
    
    // 追加された投稿のデータを返す
    return {
      id: docRef.id,
      ...post,
      createdAt: new Date(),
      views: 1,
      isPopular: false
    } as Post;
  } catch (error) {
    console.error("投稿の追加に失敗しました:", error);
    return null;
  }
}

// 投稿を削除
export async function deletePost(postId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, "posts", postId));
    return true;
  } catch (error) {
    console.error("投稿の削除に失敗しました:", error);
    return false;
  }
}

// すべての投稿を削除（管理者専用）
export async function deleteAllPosts(): Promise<boolean> {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    
    // 一括削除するための処理
    const deletePromises = querySnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("全投稿の削除に失敗しました:", error);
    return false;
  }
}