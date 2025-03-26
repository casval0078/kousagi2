// Firebase初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ログイン処理
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
}

document.getElementById('login-btn').onclick = login;

// ログアウト処理
async function logout() {
  await signOut(auth);
  window.location.href = 'index.html';
}
document.getElementById('logout-btn')?.addEventListener('click', logout);

// 入退室記録
async function recordAttendance(type) {
  const childID = document.getElementById('child-select').value;
  if (!childID) return alert('児童を選択してください');

  try {
    await addDoc(collection(db, 'attendance2'), {
      childID: childID,
      type: type,
      timestamp: serverTimestamp()
    });
    alert(`${type === 'checkin' ? '入室' : '退室'}が記録されました。`);
  } catch (error) {
    alert(error.message);
  }
}
document.getElementById('checkin-btn')?.addEventListener('click', () => recordAttendance('checkin'));
document.getElementById('checkout-btn')?.addEventListener('click', () => recordAttendance('checkout'));

// 児童リスト表示
async function loadChildren() {
  const childSelect = document.getElementById('child-select');
  const querySnapshot = await getDocs(collection(db, 'children'));

  querySnapshot.forEach(doc => {
    const option = document.createElement('option');
    option.value = doc.id;
    option.textContent = doc.data().name;
    childSelect.appendChild(option);
  });
}
document.addEventListener('DOMContentLoaded', loadChildren);
