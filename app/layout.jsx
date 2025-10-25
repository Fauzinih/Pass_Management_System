// app/layout.jsx
import './globals.css'

export const metadata = {
  title: 'Secure Pass Manager',
  description: 'A simple end-to-end encrypted password manager',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}