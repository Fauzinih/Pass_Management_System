import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { importKeyFromBase64, encryptWithKey } from '@/lib/crypto'
import Navbar from '../Navbar'

export default function AddPage() {
  const [title, setTitle] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSave = async () => {
    if (!title || !username || !password) {
      alert('Semua field harus diisi.')
      return
    }

    // ambil sesi pengguna
    const { data } = await supabase.auth.getSession()
    const session = data.session
    if (!session) {
      window.location.href = '/auth/login'
      return
    }

    // ambil encryption key
    const keyB64 = sessionStorage.getItem('enc_key_base64')
    if (!keyB64) {
      alert('Encryption key tidak ditemukan. Silakan login ulang dan masukkan master password.')
      return
    }

    try {
      // enkripsi password
      const key = await importKeyFromBase64(keyB64)
      const { ciphertext, iv } = await encryptWithKey(key, password)

      // simpan ke tabel
      const { error } = await supabase.from('vault_entries').insert([
        {
          user_id: session.user.id,
          title,
          username,
          ciphertext,
          iv
        }
      ])

      if (error) throw error

      alert('Data berhasil disimpan!')
      window.location.href = '/dashboard'
    } catch (err) {
      console.error('Error saat menyimpan:', err)
      alert('Terjadi kesalahan: ' + err.message)
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Tambah Password</h2>
        <input
          placeholder="Judul (contoh: Gmail)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ marginBottom: 8 }}
        /><br />
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{ marginBottom: 8 }}
        /><br />
        <input
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ marginBottom: 8 }}
        /><br />
        <button onClick={handleSave}>Simpan</button>
      </div>
    </>
  )
}