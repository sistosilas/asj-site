// ============================================================
//  ASJ PORTAL — Módulo de Banco de Dados (Firestore)
// ============================================================
import { auth, db, firebaseConfig } from './firebase-config.js';
import {
  collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import {
  initializeApp, deleteApp
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ── USUÁRIOS ─────────────────────────────────────────────────

export async function listarClientes() {
  const q = query(
    collection(db, 'usuarios'),
    where('role', '==', 'cliente'),
    orderBy('nome')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function buscarCliente(uid) {
  const snap = await getDoc(doc(db, 'usuarios', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// Cria cliente usando app secundário para não encerrar a sessão do admin
export async function criarCliente({ nome, email, senha, empresa, telefone, cnpj }) {
  const secondaryApp  = initializeApp(firebaseConfig, 'create-client-' + Date.now());
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, senha);
    const uid  = cred.user.uid;

    await setDoc(doc(db, 'usuarios', uid), {
      nome,
      email,
      empresa:      empresa  || '',
      telefone:     telefone || '',
      cnpj:         cnpj     || '',
      role:         'cliente',
      ativo:        true,
      criadoEm:     serverTimestamp(),
      ultimoAcesso: null
    });

    await fbSignOut(secondaryAuth);
    return uid;
  } finally {
    await deleteApp(secondaryApp);
  }
}

export async function atualizarCliente(uid, dados) {
  const { id: _id, ...rest } = dados;
  await updateDoc(doc(db, 'usuarios', uid), {
    ...rest,
    atualizadoEm: serverTimestamp()
  });
}

export async function toggleAtivoCliente(uid, ativo) {
  await updateDoc(doc(db, 'usuarios', uid), { ativo });
}

export async function resetarSenhaCliente(email) {
  await sendPasswordResetEmail(auth, email);
}

// ── CATÁLOGO EXCLUSIVO ────────────────────────────────────────
// Coleção: 'produtos_portal' (separada do catálogo público)

export async function listarProdutosPortal(filtros = {}) {
  const constraints = [orderBy('nome')];
  if (filtros.categoria) {
    constraints.unshift(where('categoria', '==', filtros.categoria));
  }
  const snap = await getDocs(query(collection(db, 'produtos_portal'), ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function buscarProdutoPortal(id) {
  const snap = await getDoc(doc(db, 'produtos_portal', id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function salvarProdutoPortal(produto) {
  if (produto.id) {
    const { id, ...data } = produto;
    await updateDoc(doc(db, 'produtos_portal', id), {
      ...data,
      atualizadoEm: serverTimestamp()
    });
    return id;
  }
  const ref = await addDoc(collection(db, 'produtos_portal'), {
    ...produto,
    criadoEm: serverTimestamp()
  });
  return ref.id;
}

export async function excluirProdutoPortal(id) {
  await deleteDoc(doc(db, 'produtos_portal', id));
}

export async function listarCategoriasPortal() {
  const produtos = await listarProdutosPortal();
  const cats = [...new Set(produtos.map(p => p.categoria).filter(Boolean))];
  return cats.sort();
}

// ── PEDIDOS ──────────────────────────────────────────────────

export async function criarPedido({ clienteId, clienteNome, clienteEmpresa, itens, observacao }) {
  const ref = await addDoc(collection(db, 'pedidos'), {
    clienteId,
    clienteNome:    clienteNome    || '',
    clienteEmpresa: clienteEmpresa || '',
    itens,
    observacao:     observacao     || '',
    status:         'pendente',
    criadoEm:       serverTimestamp()
  });
  return ref.id;
}

export async function listarPedidosCliente(clienteId) {
  const q = query(
    collection(db, 'pedidos'),
    where('clienteId', '==', clienteId),
    orderBy('criadoEm', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function listarTodosPedidos() {
  const q = query(
    collection(db, 'pedidos'),
    orderBy('criadoEm', 'desc'),
    limit(200)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function atualizarStatusPedido(id, status) {
  await updateDoc(doc(db, 'pedidos', id), {
    status,
    atualizadoEm: serverTimestamp()
  });
}

// ── CARRINHO (localStorage) ──────────────────────────────────

export function getCarrinho() {
  return JSON.parse(localStorage.getItem('asj_carrinho') || '[]');
}

export function setCarrinho(itens) {
  localStorage.setItem('asj_carrinho', JSON.stringify(itens));
}

export function adicionarAoCarrinho(produto, quantidade = 1) {
  const carrinho = getCarrinho();
  const idx = carrinho.findIndex(i => i.id === produto.id);
  if (idx >= 0) {
    carrinho[idx].quantidade += quantidade;
  } else {
    carrinho.push({ ...produto, quantidade });
  }
  setCarrinho(carrinho);
  return carrinho.length;
}

export function removerDoCarrinho(produtoId) {
  setCarrinho(getCarrinho().filter(i => i.id !== produtoId));
}

export function atualizarQuantidade(produtoId, quantidade) {
  const carrinho = getCarrinho().map(i =>
    i.id === produtoId ? { ...i, quantidade: Math.max(1, quantidade) } : i
  );
  setCarrinho(carrinho);
}

export function limparCarrinho() {
  localStorage.removeItem('asj_carrinho');
}
