import { useState } from 'react'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      if (password === 'yourpassword') {
        sessionStorage.setItem('app_auth', 'true')
        onLogin()
      } else {
        setError('Incorrect password. Try again.')
      }
      setLoading(false)
    }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f5f4f1', fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, border: '0.5px solid #e0ddd6',
        padding: '40px 36px', width: '100%', maxWidth: 380, boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: '#1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, fontSize: 22
          }}>📁</div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: '#1a1a1a' }}>Client Files</h1>
          <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>Team access only — enter your password</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="password"
            placeholder="Team password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoFocus
            style={{
              padding: '10px 14px', fontSize: 14, borderRadius: 8,
              border: `1px solid ${error ? '#e24b4a' : '#ddd'}`,
              outline: 'none', width: '100%', boxSizing: 'border-box'
            }}
          />
          {error && <p style={{ fontSize: 12, color: '#e24b4a', margin: 0 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              padding: '10px', fontSize: 14, fontWeight: 500, borderRadius: 8,
              border: 'none', background: '#1a1a1a', color: '#fff',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.6 : 1
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
