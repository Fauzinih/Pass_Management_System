import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const handleLogout = async () => {
    // Hapus kunci enkripsi dan logout dari Supabase
    sessionStorage.removeItem('enc_key_base64')
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: '1px solid #ddd',
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
      }}
    >
      <div style={{ flexGrow: 1 }}>
        <Link href="/" style={{ marginRight: 16, textDecoration: 'none', color: '#0070f3' }}>
          Dashboard
        </Link>
        <Link href="/add" style={{ marginRight: 16, textDecoration: 'none', color: '#0070f3' }}>
          Tambah
        </Link>
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          padding: '6px 12px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </nav>
  )
}