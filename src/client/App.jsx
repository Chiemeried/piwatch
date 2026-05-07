import { useState, useEffect } from 'react'
import WalletList from './components/WalletList.jsx'
import ActivityFeed from './components/ActivityFeed.jsx'
import AddWalletModal from './components/AddWalletModal.jsx'

const PI_GOLD = '#f0a500'
const PI_DARK = '#0a0a12'
const PI_CARD = '#12121f'
const PI_BORDER = '#1e1e35'
const PI_GREEN = '#00e87a'
const PI_BLUE = '#4f8ef7'
const PI_PURPLE = '#a259ff'

export default function App() {
  const [wallets, setWallets] = useState([])
  const [transactions, setTransactions] = useState([])
  const [activeTab, setActiveTab] = useState('wallets')
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchWallets() {
    try {
      const res = await fetch('/api/wallets')
      const data = await res.json()
      setWallets(data)
    } catch (err) {
      showToast('Failed to load wallets', 'error')
    }
  }

  async function fetchTransactions() {
    try {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    Promise.all([fetchWallets(), fetchTransactions()])
      .finally(() => setLoading(false))
    const interval = setInterval(() => {
      fetchWallets()
      fetchTransactions()
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleAddWallet(form) {
    try {
      const res = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await fetchWallets()
      showToast('Wallet added and monitoring started!')
      setShowModal(false)
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  async function handleToggle(id) {
    try {
      await fetch(`/api/wallets/${id}/toggle`, { method: 'PATCH' })
      await fetchWallets()
    } catch (err) {
      showToast('Failed to update wallet', 'error')
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`/api/wallets/${id}`, { method: 'DELETE' })
      await fetchWallets()
      showToast('Wallet removed')
    } catch (err) {
      showToast('Failed to delete wallet', 'error')
    }
  }

  const activeCount = wallets.filter(w => w.active).length

  return (
    <div style={{
      minHeight: '100vh',
      background: PI_DARK,
      color: '#fff',
      fontFamily: "'Segoe UI', system-ui, sans-serif"
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideIn { from{transform:translateX(120%);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #2a2a4a; border-radius: 4px; }
        input { color: #fff; }
        input::placeholder { color: #444; }
      `}</style>

      <div style={{
        position: 'fixed', top: -200, left: '50%',
        transform: 'translateX(-50%)', width: 800, height: 400,
        background: `radial-gradient(ellipse, ${PI_GOLD}0a 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: 0
      }} />

      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 200,
          background: PI_CARD,
          border: `1px solid ${toast.type === 'error' ? '#ff456060' : PI_GREEN + '60'}`,
          borderRadius: 14, padding: '16px 20px', minWidth: 280,
          animation: 'slideIn 0.4s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
        }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{toast.msg}</div>
        </div>
      )}

      {showModal && (
        <AddWalletModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddWallet}
        />
      )}

      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${PI_BORDER}`,
        padding: '0 24px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 66,
        position: 'sticky', top: 0,
        background: PI_DARK + 'ee',
        backdropFilter: 'blur(12px)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: PI_GOLD + '18',
            border: `1px solid ${PI_GOLD}40`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22, fontFamily: 'serif'
          }}>π</div>
          <div>
            <div style={{
              fontFamily: "'Crimson Pro', Georgia, serif",
              fontWeight: 700, fontSize: 20,
              background: `linear-gradient(90deg, ${PI_GOLD}, #fff8dc)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>PiWatch</div>
            <div style={{ fontSize: 10, color: '#555', letterSpacing: 2 }}>WALLET MONITOR</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#888' }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: PI_GREEN,
              boxShadow: `0 0 8px ${PI_GREEN}`,
              display: 'inline-block',
              animation: 'pulse 2s infinite'
            }} />
            {activeCount} monitoring
          </div>
          <button onClick={() => setShowModal(true)} style={{
            background: PI_GOLD, color: '#000',
            border: 'none', borderRadius: 10,
            padding: '9px 18px', fontWeight: 700,
            fontSize: 14, cursor: 'pointer'
          }}>+ Add Wallet</button>
        </div>
      </header>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1, borderBottom: `1px solid ${PI_BORDER}`,
        background: PI_BORDER
      }}>
        {[
          { label: 'Active Monitors', value: activeCount, color: PI_GREEN, icon: '📡' },
          { label: 'Total Wallets', value: wallets.length, color: PI_BLUE, icon: '👛' },
          { label: 'Transactions', value: transactions.length, color: PI_GOLD, icon: '📊' },
          { label: 'Uptime', value: '24/7', color: PI_PURPLE, icon: '⚡' },
        ].map((s, i) => (
          <div key={i} style={{
            background: PI_CARD, padding: '18px 20px',
            animation: `fadeUp 0.4s ease ${i * 0.08}s both`
          }}>
            <div style={{ fontSize: 11, color: '#555', marginBottom: 6, letterSpacing: 1 }}>
              {s.icon} {s.label}
            </div>
            <div style={{
              fontSize: 26, fontWeight: 700,
              color: s.color,
              fontFamily: "'Crimson Pro', Georgia, serif"
            }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        <div style={{
          display: 'flex', gap: 4,
          marginBottom: 24,
          borderBottom: `1px solid ${PI_BORDER}`
        }}>
          {['wallets', 'activity'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              background: 'none', border: 'none',
              color: activeTab === tab ? PI_GOLD : '#555',
              borderBottom: activeTab === tab ? `2px solid ${PI_GOLD}` : '2px solid transparent',
              padding: '10px 20px', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              letterSpacing: 1, textTransform: 'uppercase',
              transition: 'all 0.2s', marginBottom: -1
            }}>
              {tab === 'wallets' ? `👛 Wallets (${wallets.length})` : `📋 Activity (${transactions.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: '#444' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            Loading...
          </div>
        ) : activeTab === 'wallets' ? (
          <WalletList
            wallets={wallets}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ) : (
          <ActivityFeed transactions={transactions} />
        )}
      </div>

      <div style={{
        textAlign: 'center', padding: 24,
        color: '#333', fontSize: 12,
        borderTop: `1px solid ${PI_BORDER}`
      }}>
        PiWatch · Running 24/7 · Pi Network Blockchain Monitor
        <span style={{ color: PI_GOLD, marginLeft: 8 }}>π</span>
      </div>
    </div>
  )
}
