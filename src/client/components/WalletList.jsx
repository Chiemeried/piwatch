const PI_GOLD = '#f0a500'
const PI_CARD = '#12121f'
const PI_BORDER = '#1e1e35'
const PI_GREEN = '#00e87a'
const PI_RED = '#ff4560'
const PI_BLUE = '#4f8ef7'

export default function WalletList({ wallets, onToggle, onDelete }) {
  if (wallets.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        color: '#444', fontSize: 16
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👛</div>
        <div style={{ color: '#666', marginBottom: 8 }}>No wallets added yet</div>
        <div style={{ fontSize: 13 }}>Click "Add Wallet" to start monitoring</div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {wallets.map((w, i) => {
        const short = w.address.slice(0, 8) + '...' + w.address.slice(-6)
        return (
          <div key={w.id} style={{
            background: PI_CARD,
            border: `1px solid ${w.active ? PI_GOLD + '30' : PI_BORDER}`,
            borderRadius: 16,
            padding: '20px 24px',
            position: 'relative',
            overflow: 'hidden',
            animation: `fadeUp 0.4s ease ${i * 0.06}s both`
          }}>
            {w.active && (
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                background: `linear-gradient(180deg, ${PI_GOLD}, ${PI_GREEN})`,
                borderRadius: '3px 0 0 3px'
              }} />
            )}

            <div style={{
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 14
            }}>
              {/* Left */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, marginBottom: 10, flexWrap: 'wrap'
                }}>
                  <span style={{
                    width: 9, height: 9, borderRadius: '50%',
                    background: w.active ? PI_GREEN : '#444',
                    boxShadow: w.active ? `0 0 8px ${PI_GREEN}` : 'none',
                    flexShrink: 0,
                    animation: w.active ? 'pulse 2s infinite' : 'none'
                  }} />
                  <span style={{ fontWeight: 700, fontSize: 15 }}>
                    {w.label || 'Unnamed Wallet'}
                  </span>
                  <span style={{
                    background: w.active ? PI_GREEN + '18' : '#44444418',
                    border: `1px solid ${w.active ? PI_GREEN + '40' : '#44444440'}`,
                    color: w.active ? PI_GREEN : '#666',
                    fontSize: 10, borderRadius: 6,
                    padding: '2px 8px', letterSpacing: 1
                  }}>
                    {w.active ? 'LIVE' : 'PAUSED'}
                  </span>
                </div>

                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11, color: PI_GOLD,
                  background: '#0d0d1a',
                  padding: '8px 12px', borderRadius: 8,
                  marginBottom: 12, wordBreak: 'break-all'
                }}>{w.address}</div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span style={{
                    background: PI_BLUE + '18',
                    border: `1px solid ${PI_BLUE}40`,
                    color: PI_BLUE, fontSize: 11,
                    borderRadius: 6, padding: '3px 10px',
                    fontFamily: 'monospace'
                  }}>🤖 {w.chat_id}</span>

                  <span style={{
                    background: PI_GOLD + '18',
                    border: `1px solid ${PI_GOLD}40`,
                    color: PI_GOLD, fontSize: 11,
                    borderRadius: 6, padding: '3px 10px'
                  }}>
                    Added {new Date(w.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Right */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'flex-end', gap: 10
              }}>
                <div style={{ fontSize: 12, color: '#555', textAlign: 'right' }}>
                  <div style={{ color: '#888', marginBottom: 3 }}>Last TX ID</div>
                  <div style={{
                    fontFamily: 'monospace', fontSize: 11, color: '#666'
                  }}>
                    {w.last_tx_id
                      ? w.last_tx_id.slice(0, 12) + '...'
                      : 'No transactions yet'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => onToggle(w.id)} style={{
                    background: w.active ? '#0a1a0a' : '#0d0d0d',
                    border: `1px solid ${w.active ? PI_GREEN + '50' : PI_BORDER}`,
                    color: w.active ? PI_GREEN : '#666',
                    borderRadius: 8, padding: '7px 14px',
                    cursor: 'pointer', fontSize: 12, fontWeight: 600
                  }}>
                    {w.active ? '⏸ Pause' : '▶ Resume'}
                  </button>

                  <button onClick={() => {
                    if (confirm('Remove this wallet monitor?')) onDelete(w.id)
                  }} style={{
                    background: '#1a0808',
                    border: `1px solid ${PI_RED}40`,
                    color: PI_RED, borderRadius: 8,
                    padding: '7px 12px',
                    cursor: 'pointer', fontSize: 13
                  }}>🗑</button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
