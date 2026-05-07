import { useState } from 'react'

const PI_GOLD = '#f0a500'
const PI_CARD = '#12121f'
const PI_BORDER = '#1e1e35'
const PI_GREEN = '#00e87a'
const PI_RED = '#ff4560'

export default function AddWalletModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    label: '',
    address: '',
    telegramToken: '',
    chatId: ''
  })

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit() {
    setLoading(true)
    await onAdd(form)
    setLoading(false)
  }

  const inputStyle = {
    background: '#0d0d1a',
    border: `1px solid ${PI_BORDER}`,
    borderRadius: 10,
    padding: '12px 16px',
    fontSize: 13,
    outline: 'none',
    width: '100%',
    fontFamily: 'monospace',
    color: '#fff'
  }

  const labelStyle = {
    color: '#888',
    fontSize: 12,
    marginBottom: 6,
    letterSpacing: 1
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.8)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(8px)',
      padding: 20
    }}>
      <div style={{
        background: PI_CARD,
        border: `1px solid ${PI_BORDER}`,
        borderRadius: 20,
        width: 460,
        maxWidth: '100%',
        padding: 32,
        position: 'relative',
        boxShadow: `0 0 60px ${PI_GOLD}15`
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: 16, right: 16,
          background: 'none', border: 'none',
          color: '#555', fontSize: 20, cursor: 'pointer'
        }}>✕</button>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 12, marginBottom: 24
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: PI_GOLD + '18',
            border: `1px solid ${PI_GOLD}40`,
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22, fontFamily: 'serif'
          }}>π</div>
          <div>
            <div style={{
              fontWeight: 700, fontSize: 17, color: PI_GOLD
            }}>Add Wallet Monitor</div>
            <div style={{ color: '#555', fontSize: 12 }}>Step {step} of 2</div>
          </div>
        </div>

        {/* Step bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 3,
              background: s <= step ? PI_GOLD : PI_BORDER,
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={labelStyle}>WALLET LABEL (OPTIONAL)</div>
              <input
                value={form.label}
                onChange={e => update('label', e.target.value)}
                placeholder="e.g. Main Wallet"
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>PI WALLET ADDRESS *</div>
              <input
                value={form.address}
                onChange={e => update('address', e.target.value)}
                placeholder="GDZOM3FEFHFBZ7KW..."
                style={{ ...inputStyle, color: PI_GOLD }}
              />
            </div>

            <div style={{
              background: '#0d0d1a',
              border: `1px solid ${PI_GOLD}20`,
              borderRadius: 10, padding: 14,
              fontSize: 12, color: '#666', lineHeight: 1.8
            }}>
              💡 Your Pi wallet address starts with <span style={{ color: PI_GOLD }}>G</span> and
              is found in your Pi Browser under wallet settings.
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.address}
              style={{
                background: form.address ? PI_GOLD : '#222',
                color: form.address ? '#000' : '#555',
                border: 'none', borderRadius: 10,
                padding: '13px', fontWeight: 700,
                fontSize: 15, cursor: form.address ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}>
              Next →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={labelStyle}>TELEGRAM BOT TOKEN *</div>
              <input
                value={form.telegramToken}
                onChange={e => update('telegramToken', e.target.value)}
                placeholder="7412038xxxx:AAHxxxxxxxx"
                style={inputStyle}
              />
            </div>

            <div>
              <div style={labelStyle}>TELEGRAM CHAT ID *</div>
              <input
                value={form.chatId}
                onChange={e => update('chatId', e.target.value)}
                placeholder="@yourchannel or -100xxxxxxxxx"
                style={inputStyle}
              />
            </div>

            <div style={{
              background: '#0d0d1a',
              border: `1px solid ${PI_GOLD}20`,
              borderRadius: 10, padding: 14,
              fontSize: 12, color: '#666', lineHeight: 1.9
            }}>
              💡 <b style={{ color: '#888' }}>How to get these:</b><br />
              1. Open Telegram → search <span style={{ color: PI_GOLD }}>@BotFather</span><br />
              2. Send <span style={{ color: PI_GOLD }}>/newbot</span> → follow steps → copy token<br />
              3. Add your bot to your group/channel<br />
              4. Send a message then visit:<br />
              <span style={{ color: PI_BLUE, fontSize: 11 }}>
                api.telegram.org/bot(TOKEN)/getUpdates
              </span><br />
              5. Copy the <span style={{ color: PI_GOLD }}>chat.id</span> value
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, background: 'none',
                color: '#888',
                border: `1px solid ${PI_BORDER}`,
                borderRadius: 10, padding: '13px',
                cursor: 'pointer', fontSize: 14
              }}>← Back</button>

              <button
                onClick={handleSubmit}
                disabled={!form.telegramToken || !form.chatId || loading}
                style={{
                  flex: 2,
                  background: form.telegramToken && form.chatId ? PI_GOLD : '#222',
                  color: form.telegramToken && form.chatId ? '#000' : '#555',
                  border: 'none', borderRadius: 10,
                  padding: '13px', fontWeight: 700,
                  fontSize: 15,
                  cursor: form.telegramToken && form.chatId ? 'pointer' : 'not-allowed'
                }}>
                {loading ? '⏳ Activating...' : '🚀 Activate Monitor'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
