// Firebase 初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPUoZSZCBmJi7yMtIp6apBEfEJqIJWZRY",
  authDomain: "kousagi-2e126.firebaseapp.com",
  projectId: "kousagi-2e126",
  storageBucket: "kousagi-2e126.firebasestorage.app",
  messagingSenderId: "379985487644",
  appId: "1:379985487644:web:e8ca61a2fb7cbc2fc37cd9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ログイン処理
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('ログイン成功');
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}

document.getElementById('login-btn')?.addEventListener('click', login);

// ログアウト処理
async function logout() {
  try {
    await signOut(auth);
    alert('ログアウトしました');
    window.location.href = 'index.html';
  } catch (error) {
    alert(`エラー: ${error.message}`);
  }
}
document.getElementById('logout-btn')?.addEventListener('click', logout);

// 児童リストの取得
async function fetchChildren() {
  const childrenList = document.getElementById('children-list');
  childrenList.innerHTML = '';

  try {
    const querySnapshot = await getDocs(collection(db, 'children'));
    querySnapshot.forEach((doc) => {
      const childData = doc.data();
      const li = document.createElement('li');
      li.textContent = childData.name;
      childrenList.appendChild(li);
    });
  } catch (error) {
    console.error('エラー:', error);
  }
}

// 初期ロード
if (window.location.pathname.includes('dashboard.html')) {
  fetchChildren();
} 
