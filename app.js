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

// ログイン処理
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('ログイン成功');
  } catch (error) {
    console.error('ログイン失敗', error);
    alert('ログインに失敗しました。');
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log('ログアウトしました');
  } catch (error) {
    console.error('ログアウト失敗', error);
  }
});

// 認証状態の監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadChildren();
    loadHistory();
  } else {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
  }
});

// 児童一覧読み込み
async function loadChildren() {
  const childSelect = document.getElementById('child-select');
  childSelect.innerHTML = '';

  const q = query(collection(db, 'children'));
  const querySnapshot = await onSnapshot(q, (snapshot) => {
    snapshot.forEach((doc) => {
      const option = document.createElement('option');
      option.value = doc.id;
      option.textContent = doc.data().name;
      childSelect.appendChild(option);
    });
  });
}

// 入室処理
const checkinBtn = document.getElementById('checkin-btn');
checkinBtn.addEventListener('click', async () => {
  const childId = document.getElementById('child-select').value;
  try {
    await addDoc(collection(db, 'attendance2'), {
      childId,
      type: 'checkin',
      timestamp: serverTimestamp()
    });
    alert('入室を記録しました');
  } catch (error) {
    console.error('入室記録失敗', error);
  }
});

// 退室処理
const checkoutBtn = document.getElementById('checkout-btn');
checkoutBtn.addEventListener('click', async () => {
  const childId = document.getElementById('child-select').value;
  try {
    await addDoc(collection(db, 'attendance2'), {
      childId,
      type: 'checkout',
      timestamp: serverTimestamp()
    });
    alert('退室を記録しました');
  } catch (error) {
    console.error('退室記録失敗', error);
  }
});

// 入退室履歴表示
async function loadHistory() {
  const historyList = document.getElementById('history');
  historyList.innerHTML = '';

  const q = query(collection(db, 'attendance'), orderBy('timestamp', 'desc'));
  onSnapshot(q, (snapshot) => {
    historyList.innerHTML = '';
    snapshot.forEach((doc) => {
      const li = document.createElement('li');
      li.textContent = `${doc.data().childId} - ${doc.data().type} - ${doc.data().timestamp?.toDate()}`;
      historyList.appendChild(li);
    });
  });
} 
