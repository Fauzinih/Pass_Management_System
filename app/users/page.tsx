"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UserList() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      setLoading(true);

      const { data, error } = await supabase.from("profiles").select("*");

      if (error) {
        console.error("Error loading users:", error);
        alert("Gagal memuat data pengguna!");
      } else if (data) {
        console.log("Data pengguna:", data);
        setUsers(data);
      }

      setLoading(false);
    }

    loadUsers();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>📋 Daftar Pengguna</h2>

      {loading ? (
        <p>Sedang memuat data...</p>
      ) : users.length === 0 ? (
        <p>Belum ada pengguna terdaftar.</p>
      ) : (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: 16,
            border: "1px solid #ccc",
          }}
        >
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>No</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>User ID</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Salt</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{i + 1}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {user.id}
                </td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  {user.pbkdf2_salt || "(kosong)"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}