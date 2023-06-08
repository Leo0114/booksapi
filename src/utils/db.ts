import { Pool } from 'pg'
import 'dotenv/config'

const user = process.env.DB_USER ?? 'root'
const host = process.env.DB_HOST ?? 'localhost'
const database = process.env.DB_DATABASE ?? 'db'
const password = process.env.DB_PASSWORD ?? 'root'
const port = Number(process.env.DB_PORT) ?? 5432

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
})

export default pool
