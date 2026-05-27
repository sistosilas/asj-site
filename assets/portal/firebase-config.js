// ============================================================
//  ASJ PORTAL — Configuração Firebase
//  ⚠️  Preencha com suas credenciais do Firebase Console
//  https://console.firebase.google.com → Projeto → ⚙ Configurações
// ============================================================
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth }       from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export const firebaseConfig = {
  apiKey:            "SUBSTITUA_SUA_API_KEY",
  authDomain:        "SUBSTITUA.firebaseapp.com",
  projectId:         "SUBSTITUA",
  storageBucket:     "SUBSTITUA.appspot.com",
  messagingSenderId: "SUBSTITUA",
  appId:             "SUBSTITUA"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
