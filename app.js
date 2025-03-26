// Firebase初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPUoZSZCBmJi7yMtIp6apBEfEJqIJWZRY",
  authDomain: "kousagi-2e126.firebaseapp.com",
  databaseURL: "https://kousagi-2e126-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kousagi-2e126",
  storageBucket: "kousagi-2e126.firebasestorage.app",
  messagingSenderId: "379985487644",
  appId: "1:379985487644:web:e8ca61a2fb7cbc2fc37cd9",
  measurementId: "G-DB225BE3JD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ログイン処理
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("ログイン成功！");
      window.location.href = "dashboard.html"; // 画面遷移
    })
    .catch((error) => {
      alert("ログイン失敗: " + error.message);
    });
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
