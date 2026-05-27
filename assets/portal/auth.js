// ============================================================
//  ASJ PORTAL — Módulo de Autenticação
// ============================================================
import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  doc, getDoc, updateDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// ── Login ────────────────────────────────────────────────────
export async function login(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const profile = await getUserProfile(cred.user.uid);

  if (!profile)         throw new Error('Perfil de usuário não encontrado.');
  if (!profile.ativo)   throw new Error('Acesso desativado. Contate a ASJ.');

  // Registra último acesso
  await updateDoc(doc(db, 'usuarios', cred.user.uid), {
    ultimoAcesso: serverTimestamp()
  }).catch(() => {});

  return { user: cred.user, profile };
}

// ── Logout ───────────────────────────────────────────────────
export async function logout() {
  await signOut(auth);
}

// ── Reset de senha ───────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── Perfil do usuário ────────────────────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ── Guard: páginas do portal (cliente) ──────────────────────
// Chame no topo de cada página autenticada do portal
export function requireAuth(redirectTo = '../portal-login.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) { window.location.href = redirectTo; return; }

      const profile = await getUserProfile(user.uid);
      if (!profile || !profile.ativo) {
        await signOut(auth);
        window.location.href = redirectTo + '?msg=inativo';
        return;
      }

      resolve({ user, profile });
    });
  });
}

// ── Guard: páginas admin ─────────────────────────────────────
export function requireAdmin(redirectTo = '../portal-login.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) { window.location.href = redirectTo; return; }

      const profile = await getUserProfile(user.uid);
      if (!profile || profile.role !== 'admin') {
        window.location.href = redirectTo + '?msg=acesso_negado';
        return;
      }

      resolve({ user, profile });
    });
  });
}

export { onAuthStateChanged };
