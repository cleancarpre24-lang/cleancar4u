import { useState } from 'react'

const inputStyle = {
  padding: '8px 10px', fontSize: 13, borderRadius: 8,
  border: '1px solid #ddd', width: '100%', boxSizing: 'border-box',
  fontFamily: 'inherit', background: '#fafafa'
}
const labelStyle = { fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 4, display: 'block' }

export default function PaymentModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    amount: '', date: new Date().toISOString().split('T')[0], description: ''
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.amount || isNaN(form.amount)) return
    setSaving(true)
    await onSave({ ...form, amount: parseFloat(form.amount).toFixed(2) })
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
        width: '100%', maxWidth: 400, fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{
          padding: '16px 20px', borderBottom: '0.5px solid #eee',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>Add payment</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#999' }}>✕</button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Amount ($)</label>
              <input style={inputStyle} type="number" step="0.01" placeholder="150.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Date</label>
              <input style={inputStyle} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Service / Description</label>
            <input style={inputStyle} placeholder="Full detail, ceramic coating..." value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
        </div>
        <div style={{ padding: '14px 20px', borderTop: '0.5px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '8px 18px', fontSize: 13, borderRadius: 8, border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !form.amount} style={{
            padding: '8px 18px', fontSize: 13, fontWeight: 500, borderRadius: 8,
            border: 'none', background: '#1a1a1a', color: '#fff',
            cursor: saving || !form.amount ? 'not-allowed' : 'pointer',
            opacity: saving || !form.amount ? 0.6 : 1
          }}>
            {saving ? 'Saving...' : 'Add payment'}
          </button>
        </div>
      </div>
    </div>
  )
}
