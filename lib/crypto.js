const enc = new TextEncoder()
const dec = new TextDecoder()

// helper base64 <-> Uint8Array
export function u8ToBase64(u8) {
  return btoa(String.fromCharCode(...u8))
}
export function base64ToU8(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0))
}

// generate random salt (base64)
export async function generateSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return u8ToBase64(salt)
}

// derive CryptoKey (AES-GCM 256) from master password + salt
export async function deriveKey(masterPassword, saltBase64, iterations = 200000) {
  const salt = base64ToU8(saltBase64)
  const pwKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(masterPassword),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  )
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    },
    pwKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
  return key // CryptoKey
}

// export CryptoKey -> base64 raw (untuk demo: simpan di sessionStorage)
export async function exportKeyToBase64(key) {
  const raw = await crypto.subtle.exportKey('raw', key)
  return u8ToBase64(new Uint8Array(raw))
}

// import base64 raw -> CryptoKey
export async function importKeyFromBase64(b64) {
  const u8 = base64ToU8(b64)
  return crypto.subtle.importKey('raw', u8, 'AES-GCM', true, ['encrypt', 'decrypt'])
}

// encrypt plaintext -> { ciphertext, iv } both base64
export async function encryptWithKey(key, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  )
  return {
    ciphertext: u8ToBase64(new Uint8Array(ct)),
    iv: u8ToBase64(iv)
  }
}

// decrypt base64 ciphertext + iv -> plaintext
export async function decryptWithKey(key, ciphertextB64, ivB64) {
  const ct = base64ToU8(ciphertextB64)
  const iv = base64ToU8(ivB64)
  const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
  return dec.decode(plainBuf)
}
