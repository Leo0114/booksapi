import { PreviousAndNextBooksResponse, RowBook } from '../types'
import pool from '../utils/db'
import { parseInventoriesBook, parseInventoryBook } from '../utils/inventory'
import { INVENTORY_BOOKS_QUERY } from './constants'

export const getPreviousAndNextBooks = async (
  inventory: number,
  prev: number,
  next: number,
  identifier: number
): Promise<PreviousAndNextBooksResponse> => {
  const response = await pool.query(INVENTORY_BOOKS_QUERY, [inventory])
  const data: RowBook[] = response.rows
  const bookIndex = data.findIndex(
    (book) => book.idejemplar === String(identifier)
  )
  if (bookIndex < 0) throw new Error('Not found')

  const currentRowBook = data[bookIndex]
  const nextRowBooks = [...data].splice(bookIndex + 1, next)

  const reversedData = [...data].reverse()
  const bookReversedIndex = reversedData.findIndex(
    (book) => book.idejemplar === String(identifier)
  )
  const prevRowBooks = reversedData
    .splice(bookReversedIndex + 1, prev)
    .reverse()

  const prevBooks = parseInventoriesBook(prevRowBooks)
  const nextBooks = parseInventoriesBook(nextRowBooks)
  const currentBook = parseInventoryBook(currentRowBook)

  return { prevBooks, currentBook, nextBooks }
}
