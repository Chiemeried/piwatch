import fetch from 'node-fetch'
import cron from 'node-cron'
import { getAllWallets, updateLastTx, saveTx } from './db.js'

async function sendTelegram(token, chatId, message) {
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    })
    const data = await res.json()
    if (!data.ok) {
      console.error('Telegram error:', JSON.stringify(data))
    } else {
      console.log('✅ Telegram alert sent to', chatId)
    }
  } catch (err) {
    console.error('Telegram fetch error:', err.message)
  }
}

async function checkWallet(wallet) {
  try {
    const url = `https://api.mainnet.minepi.com/accounts/${wallet.address}/operations?limit=10&order=desc`
    console.log('Checking:', wallet.address.slice(0,10) + '...')

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    })

    if (!res.ok) {
      console.error('Pi API error:', res.status, res.statusText)
      return
    }

    const data = await res.json()
    const records = data._embedded?.records || []

    console.log('Records found:', records.length)

    if (records.length === 0) return

    const payments = records.filter(r => r.type === 'payment')

    if (payments.length === 0) {
      console.log('No payment records found')
      return
    }

    const latest = payments[0]
    const txId = latest.id

    console.log('Latest TX ID:', txId)
    console.log('Stored TX ID:', wallet.last_tx_id)

    if (txId === wallet.last_tx_id) {
      console.log('No new transactions')
      return
    }

    await updateLastTx(wallet.address, txId)

    if (!wallet.last_tx_id || wallet.last_tx_id === '') {
      console.log('First check — saving baseline TX, no alert sent')
      return
    }

    const amount = parseFloat(latest.amount).toFixed(2)
    const from = latest.from
    const to = latest.to
    const isReceive = to === wallet.address
    const type = isReceive ? 'receive' : 'send'

    await saveTx(wallet.address, txId, type, amount, from, to)

    const walletLabel = wallet.label || wallet.address
    const time = new Date().toUTCString()

    let message = ''

    if (isReceive) {
      message =
        `📥 <b>Pi Received!</b>\n\n` +
        `<b>Wallet:</b> ${walletLabel}\n` +
        `<b>Amount:</b> <b>${amount} π</b>\n\n` +
        `<b>From:</b>\n<code>${from}</code>\n\n` +
        `<b>To:</b>\n<code>${to}</code>\n\n` +
        `<b>Time:</b> ${time}\n\n` +
        `<i>PiWatch monitoring your wallet 24/7 🔍</i>`
    } else {
      message =
        `📤 <b>Pi Sent!</b>\n\n` +
        `<b>Wallet:</b> ${walletLabel}\n` +
        `<b>Amount:</b> <b>${amount} π</b>\n\n` +
        `<b>From:</b>\n<code>${from}</code>\n\n` +
        `<b>To:</b>\n<code>${to}</code>\n\n` +
        `<b>Time:</b> ${time}\n\n` +
        `<i>PiWatch monitoring your wallet 24/7 🔍</i>`
    }

    console.log('Sending Telegram alert...')
    await sendTelegram(wallet.telegram_token, wallet.chat_id, message)

  } catch (err) {
    console.error('checkWallet error:', err.message)
  }
}

export function startMonitor() {
  console.log('Pi wallet monitor started...')

  cron.schedule('*/30 * * * * *', async () => {
    try {
      const wallets = await getAllWallets()
      const active = wallets.filter(w => w.active)
      console.log(`\n[${new Date().toLocaleTimeString()}] Checking ${active.length} wallet(s)...`)
      for (const wallet of active) {
        await checkWallet(wallet)
      }
    } catch (err) {
      console.error('Monitor loop error:', err.message)
    }
  })
}
