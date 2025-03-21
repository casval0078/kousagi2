const firebaseConfig = {
  apiKey: "AIzaSyDPUoZSZCBmJi7yMtIp6apBEfEJqIJWZRY",
  authDomain: "kousagi-2e126.firebaseapp.com",
  projectId: "kousagi-2e126",
  storageBucket: "kousagi-2e126.firebasestorage.app",
  messagingSenderId: "379985487644",
  appId: "1:379985487644:web:e8ca61a2fb7cbc2fc37cd9"
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ログイン処理
function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('admin-container').style.display = 'block';
      loadChildren();
    })
    .catch(error => {
      document.getElementById('login-error').innerText = error.message;
    });
}

// 児童追加
function addChild() {
  const name = document.getElementById('child-name').value;
  if (!name) return;

  const childID = `user${Date.now()}`;
  db.collection('children').doc(childID).set({ name })
    .then(() => {
      alert('児童を追加しました');
      loadChildren();
    })
    .catch(error => {
      console.error('Error adding child:', error);
    });
}

// 児童リスト取得
function loadChildren() {
  db.collection('children').get()
    .then((querySnapshot) => {
      const list = document.getElementById('children-list');
      list.innerHTML = '';
      querySnapshot.forEach((doc) => {
        const li = document.createElement('li');
        li.textContent = `${doc.data().name} (${doc.id})`;
        list.appendChild(li);
      });
    })
    .catch((error) => {
      console.error('Error loading children:', error);
    });
}
