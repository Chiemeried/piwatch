const PI_GOLD = '#f0a500'
const PI_CARD = '#12121f'
const PI_BORDER = '#1e1e35'
const PI_GREEN = '#00e87a'
const PI_RED = '#ff4560'

export default function ActivityFeed({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        color: '#444', fontSize: 16
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <div style={{ color: '#666', marginBottom: 8 }}>No transactions yet</div>
        <div style={{ fontSize: 13 }}>
          Transactions will appear here once your wallets detect activity
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {transactions.map((tx, i) => {
        const isReceive = tx.type === 'receive'
        const shortFrom = tx.from_address
          ? tx.from_address.slice(0, 6) + '...' + tx.from_address.slice(-4)
          : '—'
        const shortTo = tx.to_address
          ? tx.to_address.slice(0, 6) + '...' + tx.to_address.slice(-4)
          : '—'

        return (
          <div key={tx.id} style={{
            background: PI_CARD,
            border: `1px solid ${PI_BORDER}`,
            borderRadius: 14,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            animation: `fadeUp 0.4s ease ${i * 0.04}s both`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: isReceive ? PI_GREEN + '18' : PI_RED + '18',
                border: `1px solid ${isReceive ? PI_GREEN + '30' : PI_RED + '30'}`,
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 18
              }}>
                {isReceive ? '📥' : '📤'}
              </div>

              <div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                  {isReceive ? 'Received ' : 'Sent '}
                  <span style={{ color: isReceive ? PI_GREEN : PI_RED }}>
                    {parseFloat(tx.amount).toFixed(2)} π
                  </span>
                  {tx.label && (
                    <span style={{ color: '#666', fontWeight: 400 }}>
                      {' '}· {tx.label}
                    </span>
                  )}
                </div>

                <div style={{
                  fontSize: 11, color: '#555',
                  fontFamily: 'monospace', lineHeight: 1.8
                }}>
                  <span>From: {shortFrom}</span>
                  <span style={{ margin: '0 8px', color: '#333' }}>→</span>
                  <span>To: {shortTo}</span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'flex-end', gap: 6
            }}>
              <div style={{ fontSize: 11, color: '#555' }}>
                {new Date(tx.timestamp).toLocaleString()}
              </div>
              <span style={{
                background: PI_GREEN + '18',
                border: `1px solid ${PI_GREEN}40`,
                color: PI_GREEN, fontSize: 10,
                borderRadius: 6, padding: '2px 8px', letterSpacing: 1
              }}>✓ ALERT SENT</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
