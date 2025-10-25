"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { deriveKey, exportKeyToBase64 } from "@/lib/crypto";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterPwd, setMasterPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || !masterPwd)
      return alert("⚠️ Mohon isi semua field!");

    setLoading(true);

    try {
      // 🔐 Coba login ke Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        alert("❌ Email atau password salah!");
        setLoading(false);
        return;
      }

      // ✅ Ambil salt dari tabel profiles
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .select("pbkdf2_salt")
        .eq("id", data.user.id)
        .single();

      if (pErr) {
        console.error("Profile fetch error:", pErr);
        alert("❌ Gagal mengambil data profil!");
        setLoading(false);
        return;
      }

      // 🔑 Derive key dari master password
      const key = await deriveKey(masterPwd, profile.pbkdf2_salt);
      const keyB64 = await exportKeyToBase64(key);
      sessionStorage.setItem("enc_key_base64", keyB64);

      // ✅ Notifikasi sukses login
      alert("✅ Login berhasil!");

      // (Opsional) arahkan ke halaman dashboard atau home
      window.location.href = "/";
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("❌ Terjadi kesalahan tak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />

      <input
        placeholder="Password (login)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <input
        placeholder="Master Password (untuk dekripsi lokal)"
        type="password"
        value={masterPwd}
        onChange={(e) => setMasterPwd(e.target.value)}
      />
      <br />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Memproses..." : "Masuk"}
      </button>
    </div>
  );
}