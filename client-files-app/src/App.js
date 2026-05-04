import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Login from './components/Login'
import ClientModal from './components/ClientModal'
import ClientDetail from './components/ClientDetail'

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
const avatarPalettes = [
  { bg: '#E6F1FB', color: '#185FA5' },
  { bg: '#E1F5EE', color: '#0F6E56' },
  { bg: '#FBEAF0', color: '#993556' },
  { bg: '#FAEEDA', color: '#854F0B' },
  { bg: '#EEEDFE', color: '#534AB7' },
]
function avatarColor(name) {
  return avatarPalettes[name.charCodeAt(0) % avatarPalettes.length]
}

export default function App() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('app_auth') === 'true')
  const [clients, setClients] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (authed) loadClients() }, [authed])

  async function loadClients() {
    setLoading(true)
    const { data: clientData } = await supabase.from('clients').select('*').order('name')
    const { data: paymentData } = await supabase.from('payments').select('*').order('date', { ascending: false })
    const { data: photoData } = await supabase.from('photos').select('*').order('created_at')
    const enriched = (clientData || []).map(c => ({
      ...c,
      payments: (paymentData || []).filter(p => p.client_id === c.id),
      photos: (photoData || []).filter(p => p.client_id === c.id)
    }))
    setClients(enriched)
    setLoading(false)
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.car || '').toLowerCase().includes(search.toLowerCase())
  )

  const activeClient = clients.find(c => c.id === activeId) || null

  async function handleSaveClient(form) {
    if (editingClient) {
      await supabase.from('clients').update(form).eq('id', editingClient.id)
    } else {
      const { data } = await supabase.from('clients').insert(form).select().single()
      if (data) setActiveId(data.id)
    }
    setShowModal(false)
    setEditingClient(null)
    await loadClients()
  }

  function openAdd() { setEditingClient(null); setShowModal(true) }
  function openEdit(client) { setEditingClient(client); setShowModal(true) }

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f5f4f1' }}>

      {/* Sidebar */}
      <div style={{ width: 260, minWidth: 260, background: '#fafaf8', borderRight: '0.5px solid #e0ddd6', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 16px 14px', borderBottom: '0.5px solid #eee' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Client Files</div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{clients.length} client{clients.length !== 1 ? 's' : ''}</div>
        </div>

        <div style={{ padding: '10px 12px', borderBottom: '0.5px solid #eee' }}>
          <input
            type="text"
            placeholder="Search by name or car..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '7px 10px', fontSize: 13, borderRadius: 8,
              border: '0.5px solid #ddd', background: '#fff', boxSizing: 'border-box', color: '#1a1a1a'
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {loading ? (
            <div style={{ padding: '20px 16px', fontSize: 13, color: '#aaa' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '20px 16px', fontSize: 13, color: '#aaa', textAlign: 'center' }}>No clients found</div>
          ) : filtered.map(c => {
            const pal = avatarColor(c.name)
            return (
              <div key={c.id} onClick={() => setActiveId(c.id)} style={{
                padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                background: c.id === activeId ? '#fff' : 'transparent',
                borderLeft: c.id === activeId ? '2px solid #378ADD' : '2px solid transparent',
                transition: 'background 0.1s'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: pal.bg, color: pal.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 13, flexShrink: 0
                }}>{initials(c.name)}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#aaa', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.car || 'No car added'}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ padding: '12px 14px', borderTop: '0.5px solid #eee', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={openAdd} style={{
            padding: '9px', fontSize: 13, borderRadius: 8,
            border: '0.5px solid #ddd', background: '#fff', cursor: 'pointer', color: '#1a1a1a', fontWeight: 500
          }}>+ Add new client</button>
          <button onClick={() => { sessionStorage.removeItem('app_auth'); setAuthed(false) }} style={{
            padding: '7px', fontSize: 12, borderRadius: 8,
            border: 'none', background: 'none', cursor: 'pointer', color: '#aaa'
          }}>Sign out</button>
        </div>
      </div>

      {/* Main panel */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f4f1' }}>
        {!activeClient ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#aaa' }}>
            <div style={{ fontSize: 40 }}>📁</div>
            <div style={{ fontSize: 14 }}>No client selected</div>
            <div style={{ fontSize: 12 }}>Add a client or select one from the list</div>
          </div>
        ) : (
          <ClientDetail
            client={activeClient}
            onEdit={() => openEdit(activeClient)}
            onDelete={() => { setActiveId(null); loadClients() }}
            onRefresh={loadClients}
          />
        )}
      </div>

      {showModal && (
        <ClientModal
          client={editingClient}
          onSave={handleSaveClient}
          onClose={() => { setShowModal(false); setEditingClient(null) }}
        />
      )}
    </div>
  )
}
