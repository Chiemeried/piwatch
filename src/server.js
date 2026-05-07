import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDB, getAllWallets, addWallet, toggleWallet, deleteWallet, getTransactions } from './db.js'
import { startMonitor } from './monitor.js'
import { html } from './public.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/wallets', async (req, res) => {
  try {
    const wallets = await getAllWallets()
    res.json(wallets)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/wallets', async (req, res) => {
  try {
    const { label, address, telegramToken, chatId } = req.body
    if (!address || !telegramToken || !chatId) {
      return res.status(400).json({ error: 'address, telegramToken and chatId are required' })
    }
    const wallet = await addWallet(label, address, telegramToken, chatId)
    res.json(wallet)
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ error: 'Wallet address already exists' })
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

app.patch('/api/wallets/:id/toggle', async (req, res) => {
  try {
    const wallet = await toggleWallet(req.params.id)
    res.json(wallet)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/wallets/:id', async (req, res) => {
  try {
    await deleteWallet(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/transactions', async (req, res) => {
  try {
    const txs = await getTransactions(50)
    res.json(txs)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
})

const PORT = process.env.PORT || 3000

async function start() {
  await initDB()
  startMonitor()
  app.listen(PORT, () => {
    console.log(`PiWatch running on port ${PORT}`)
  })
}

start()
