"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { importKeyFromBase64, decryptWithKey } from '@/lib/crypto'
import Navbar from './Navbar'

export default function Home() {
  const [items, setItems] = useState([])
  const [key, setKey] = useState(null)
  const [loading, setLoading] = useState(true)

  // Ambil data dan key setelah login
  useEffect(() => {
    const fetchData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const session = sessionData.session
      if (!session) {
        window.location.href = '../auth/login'
        return
      }

      // Ambil data vault user yang login
      const { data: entries, error } = await supabase
        .from('vault_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        alert('Gagal mengambil data vault: ' + error.message)
        return
      }

      setItems(entries || [])

      // Ambil kunci enkripsi dari sessionStorage
      const keyB64 = sessionStorage.getItem('enc_key_base64')
      if (!keyB64) {
        alert('Kunci enkripsi tidak ditemukan. Silakan login ulang dengan master password.')
        window.location.href = '../auth/login'
        return
      }

      // Import key dari base64 ke CryptoKey
      const importedKey = await importKeyFromBase64(keyB64)
      setKey(importedKey)
      setLoading(false)
    }

    fetchData()
  }, [])

  // Dekripsi dan tampilkan password
  const handleShow = async (item) => {
    if (!key) return alert('Kunci tidak tersedia. Login ulang dan masukkan master password.')
    try {
      const plain = await decryptWithKey(key, item.ciphertext, item.iv)
      alert(`🔐 Password untuk ${item.title}:\n\n${plain}`)
    } catch (e) {
      alert('❌ Gagal mendekripsi. Pastikan master password benar saat login.')
      console.error(e)
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Memuat data...</p>

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Vault Saya 🔒</h2>
        {items.length === 0 && <p>Belum ada entri tersimpan.</p>}
        {items.map(it => (
          <div
            key={it.id}
            style={{
              border: '1px solid #ddd',
              padding: 12,
              marginBottom: 8,
              borderRadius: 6,
              backgroundColor: '#f9f9f9'
            }}
          >
            <strong>{it.title}</strong><br />
            <small>Username: {it.username || '-'}</small><br />
            <button
              onClick={() => handleShow(it)}
              style={{ marginTop: 8, padding: '4px 8px' }}
            >
              Lihat Password
            </button>
          </div>
        ))}
      </div>
    </>
  )
}