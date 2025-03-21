// Firebase設定
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

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

// DOM要素
const loginContainer = document.getElementById('login-container');
const dashboard = document.getElementById('dashboard');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const checkinBtn = document.getElementById('checkin-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const childSelect = document.getElementById('child-select');
const historyList = document.getElementById('history');
const childNameInput = document.getElementById('child-name');
const addChildBtn = document.getElementById('add-child-btn');
const removeChildBtn = document.getElementById('remove-child-btn');

// ログイン処理
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert('ログイン成功');
    showDashboard();
    loadChildren();
  } catch (error) {
    alert('ログイン失敗: ' + error.message);
  }
});

// ログアウト処理
logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    alert('ログアウトしました');
    showLogin();
  } catch (error) {
    alert('ログアウト失敗: ' + error.message);
  }
});

// 入室処理
checkinBtn.addEventListener('click', async () => {
  const childName = childSelect.value;
  if (!childName) return alert('児童を選択してください');
  try {
    await addDoc(collection(db, 'attendance2'), {
      name: childName,
      type: 'check-in',
      timestamp: serverTimestamp()
    });
    alert('入室記録を保存しました');
    loadHistory();
  } catch (error) {
    alert('入室記録失敗: ' + error.message);
  }
});

// 退室処理
checkoutBtn.addEventListener('click', async () => {
  const childName = childSelect.value;
  if (!childName) return alert('児童を選択してください');
  try {
    await addDoc(collection(db, 'attendance2'), {
      name: childName,
      type: 'check-out',
      timestamp: serverTimestamp()
    });
    alert('退室記録を保存しました');
    loadHistory();
  } catch (error) {
    alert('退室記録失敗: ' + error.message);
  }
});

// 児童追加処理
addChildBtn.addEventListener('click', async () => {
  const childName = childNameInput.value.trim();
  if (!childName) return alert('児童名を入力してください');
  try {
    await setDoc(doc(db, 'children', childName), { name: childName });
    alert('児童を追加しました');
    loadChildren();
  } catch (error) {
    alert('児童追加失敗: ' + error.message);
  }
});

// 児童削除処理
removeChildBtn.addEventListener('click', async () => {
  const childName = childSelect.value;
  if (!childName) return alert('児童を選択してください');
  try {
    await deleteDoc(doc(db, 'children', childName));
    alert('児童を削除しました');
    loadChildren();
  } catch (error) {
    alert('児童削除失敗: ' + error.message);
  }
});

// 児童リストの読み込み
async function loadChildren() {
  try {
    const querySnapshot = await getDocs(collection(db, 'children'));
    childSelect.innerHTML = '<option value="">児童を選択</option>';
    querySnapshot.forEach(doc => {
      const option = document.createElement('option');
      option.value = doc.data().name;
      option.textContent = doc.data().name;
      childSelect.appendChild(option);
    });
  } catch (error) {
    alert('児童リスト取得失敗: ' + error.message);
  }
}

// 入退室履歴の読み込み
async function loadHistory() {
  try {
    const querySnapshot = await getDocs(collection(db, 'attendance2'));
    historyList.innerHTML = '';
    querySnapshot.forEach(doc => {
      const li = document.createElement('li');
      li.textContent = `${doc.data().name} - ${doc.data().type === 'check-in' ? '入室' : '退室'} - ${new Date(doc.data().timestamp?.toDate()).toLocaleString()}`;
      historyList.appendChild(li);
    });
  } catch (error) {
    alert('履歴取得失敗: ' + error.message);
  }
}

// 表示切り替え
function showDashboard() {
  loginContainer.style.display = 'none';
  dashboard.style.display = 'block';
}

function showLogin() {
  loginContainer.style.display = 'block';
  dashboard.style.display = 'none';
}

showLogin();
