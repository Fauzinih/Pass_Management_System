"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { generateSalt } from "@/lib/crypto";

// 🧩 Tambahkan log environment di sini:
console.log("ENV URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "ENV KEY:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + "..."
);


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterPwd, setMasterPwd] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [masterValid, setMasterValid] = useState(false);

  // Validasi input
  useEffect(() => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(regex.test(email.trim()));
  }, [email]);

  useEffect(() => {
    setPasswordValid(password.length >= 8);
  }, [password]);

  useEffect(() => {
    setMasterValid(masterPwd.length >= 8);
  }, [masterPwd]);

const handleRegister = async () => {
  console.log("👉 Tombol daftar diklik");

  if (!emailValid || !passwordValid || !masterValid) {
    return alert("Mohon periksa kembali field yang salah!");
  }

  try {
    const cleanEmail = email.trim().toLowerCase();
    console.log("🚀 Mendaftar dengan email:", cleanEmail);

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
    });

    console.log("📦 Respons dari Supabase:", data, error);

    if (error) {
      console.error("Sign up error:", error);
      return alert(`Error: ${error.message}`);
    }

    const salt = await generateSalt();
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user?.id,
      pbkdf2_salt: salt,
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return alert("Terjadi kesalahan saat membuat profil");
    }

    alert("✅ Berhasil daftar!");
  } catch (e) {
    console.error("Registration error:", e);
    alert("Terjadi kesalahan saat mendaftar: " + (e.message || e));
  }
};

  return (
    <div style={{ padding: 24, maxWidth: 400 }}>
      <h2>Register</h2>

      <input
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {!emailValid && email && (
        <small style={{ color: "red" }}>Format email tidak valid</small>
      )}
      <br />

      <input
        placeholder="Password (login)"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {!passwordValid && password && (
        <small style={{ color: "red" }}>
          Password login minimal 8 karakter
        </small>
      )}
      <br />

      <input
        placeholder="Master Password (enkripsi lokal)"
        type="password"
        value={masterPwd}
        onChange={(e) => setMasterPwd(e.target.value)}
      />
      <br />

      <button
  onClick={() => {
    console.log("✅ Tombol diklik");
    handleRegister();
  }}
  disabled={!emailValid || !passwordValid || !masterValid}
  style={{ marginTop: 8, cursor: "pointer" }}
>
  Daftar
</button>
    </div>
  );
}