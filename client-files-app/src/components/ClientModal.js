import { useState, useEffect } from 'react'

const inputStyle = {
  padding: '8px 10px', fontSize: 13, borderRadius: 8,
  border: '1px solid #ddd', width: '100%', boxSizing: 'border-box',
  fontFamily: 'inherit', background: '#fafafa'
}
const labelStyle = { fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 4, display: 'block' }

export default function ClientModal({ client, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', phone: '', location: '', car: '', car_color: '', note: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (client) setForm({
      name: client.name || '',
      phone: client.phone || '',
      location: client.location || '',
      car: client.car || '',
      car_color: client.car_color || '',
      note: client.note || ''
    })
  }, [client])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 200, padding: 20
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: 16, border: '0.5px solid #e0ddd6',
        width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '0.5px solid #eee',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>
            {client ? 'Edit client' : 'New client'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 18, color: '#999', lineHeight: 1, padding: '2px 6px'
          }}>✕</button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Full name *</label>
              <input style={inputStyle} placeholder="John Smith" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Phone number</label>
              <input style={inputStyle} placeholder="+1 555 000 0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Location / Address</label>
            <input style={inputStyle} placeholder="City, State or full address" value={form.location} onChange={e => set('location', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Car make & model</label>
              <input style={inputStyle} placeholder="2020 Honda Civic" value={form.car} onChange={e => set('car', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Car color</label>
              <input style={inputStyle} placeholder="Pearl White" value={form.car_color} onChange={e => set('car_color', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Personal detail <span style={{ color: '#378ADD', fontWeight: 400 }}>(ask next visit)</span></label>
            <textarea
              style={{ ...inputStyle, resize: 'vertical', minHeight: 80, lineHeight: 1.5 }}
              placeholder="e.g. Has a golden retriever named Max. Prefers morning appointments..."
              value={form.note}
              onChange={e => set('note', e.target.value)}
            />
          </div>
        </div>

        <div style={{
          padding: '14px 20px', borderTop: '0.5px solid #eee',
          display: 'flex', justifyContent: 'flex-end', gap: 8
        }}>
          <button onClick={onClose} style={{
            padding: '8px 18px', fontSize: 13, borderRadius: 8,
            border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer'
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.name.trim()} style={{
            padding: '8px 18px', fontSize: 13, fontWeight: 500, borderRadius: 8,
            border: 'none', background: '#1a1a1a', color: '#fff',
            cursor: saving || !form.name.trim() ? 'not-allowed' : 'pointer',
            opacity: saving || !form.name.trim() ? 0.6 : 1
          }}>
            {saving ? 'Saving...' : 'Save client'}
          </button>
        </div>
      </div>
    </div>
  )
}
