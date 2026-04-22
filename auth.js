import { getFirestore, collection, getDocs, addDoc, query, where, Timestamp }
    from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const STORAGE_KEY = '1100px_user';

async function hashPin(pin) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pin));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}

export function getUser() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}

export function logout() {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
}

export async function register(db, name, pin) {
    const trimmed = name.trim();
    if (!trimmed || pin.length !== 4) return { error: 'Name und 4-stellige PIN erforderlich.' };
    const qs = await getDocs(query(collection(db, 'users'), where('nameLower', '==', trimmed.toLowerCase())));
    if (!qs.empty) return { error: 'Name bereits vergeben.' };
    const hashed = await hashPin(pin);
    await addDoc(collection(db, 'users'), {
        name: trimmed,
        nameLower: trimmed.toLowerCase(),
        pin: hashed,
        created: Timestamp.now()
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: trimmed }));
    return { ok: true, name: trimmed };
}

export async function login(db, name, pin) {
    const trimmed = name.trim();
    const qs = await getDocs(query(collection(db, 'users'), where('nameLower', '==', trimmed.toLowerCase())));
    if (qs.empty) return { error: 'Kein Account mit diesem Namen.' };
    const hashed = await hashPin(pin);
    const doc = qs.docs[0].data();
    if (doc.pin !== hashed) return { error: 'Falsche PIN.' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ name: doc.name }));
    return { ok: true, name: doc.name };
}
