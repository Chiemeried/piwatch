import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
})

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS wallets (
      id SERIAL PRIMARY KEY,
      label TEXT,
      address TEXT NOT NULL UNIQUE,
      telegram_token TEXT NOT NULL,
      chat_id TEXT NOT NULL,
      active BOOLEAN DEFAULT true,
      last_tx_id TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      wallet_address TEXT NOT NULL,
      tx_id TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      amount TEXT NOT NULL,
      from_address TEXT,
      to_address TEXT,
      timestamp TIMESTAMP DEFAULT NOW()
    )
  `)
  console.log('Database ready')
}

export async function getAllWallets() {
  const result = await pool.query('SELECT * FROM wallets ORDER BY created_at DESC')
  return result.rows
}

export async function addWallet(label, address, telegramToken, chatId) {
  const result = await pool.query(
    `INSERT INTO wallets (label, address, telegram_token, chat_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [label, address, telegramToken, chatId]
  )
  return result.rows[0]
}

export async function toggleWallet(id) {
  const result = await pool.query(
    `UPDATE wallets SET active = NOT active WHERE id = $1 RETURNING *`, [id]
  )
  return result.rows[0]
}

export async function deleteWallet(id) {
  await pool.query('DELETE FROM wallets WHERE id = $1', [id])
}

export async function updateLastTx(address, txId) {
  await pool.query('UPDATE wallets SET last_tx_id = $1 WHERE address = $2', [txId, address])
}

export async function saveTx(walletAddress, txId, type, amount, from, to) {
  try {
    await pool.query(
      `INSERT INTO transactions (wallet_address, tx_id, type, amount, from_address, to_address) VALUES ($1, $2, $3, $4, $5, $6)`,
      [walletAddress, txId, type, amount, from, to]
    )
  } catch (e) {}
}

export async function getTransactions(limit = 50) {
  const result = await pool.query(
    `SELECT t.*, w.label FROM transactions t LEFT JOIN wallets w ON w.address = t.wallet_address ORDER BY t.timestamp DESC LIMIT $1`,
    [limit]
  )
  return result.rows
}

export default pool
