import {
  InventoryBookResponse,
  InventoryBookResponsePagination,
  InventoryComparisonResponsePagination,
  InventoryResponse,
  InventorySummaryResponse,
} from '../types'
import pool from '../utils/db'
import {
  getQuery,
  hasPropertyValue,
  parseInventories,
  parseInventoriesBook,
} from '../utils/inventory'
import { INVENTORY_BOOKS_ORDER, INVENTORY_BOOKS_QUERY } from './constants'

export const getInventories = async (): Promise<InventoryResponse> => {
  const response = await pool.query(
    'SELECT idinventario, claveiso, analista, fechainicio, fechafin, comentarios, activo FROM inventarios.inventarios'
  )
  const data = parseInventories(response.rows)
  return { total: response.rowCount, data }
}

export const getBooksFromInventoryId = async (
  id: number,
  ordered?: boolean
): Promise<InventoryBookResponse | null> => {
  try {
    const isOrdered = ordered === true
    const query = `${INVENTORY_BOOKS_QUERY} ${isOrdered ? INVENTORY_BOOKS_ORDER : ''
      }`
    const response = await pool.query(query, [id])
    const data = parseInventoriesBook(response.rows)
    const total = Number(response.rows[0].total)
    return { total, data }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getBooksFromInventoryIdPage = async (
  id: number,
  take: number,
  page: number,
  ordered?: boolean
): Promise<InventoryBookResponsePagination> => {
  const offset = page * take
  const isOrdered = ordered === true
  const query = getQuery(
    `${INVENTORY_BOOKS_QUERY} ${isOrdered ? INVENTORY_BOOKS_ORDER : ''}`
  )
  const response = await pool.query(`${getQuery(query)} OFFSET $2 LIMIT $3`, [
    id,
    offset,
    take,
  ])
  const data = parseInventoriesBook(response.rows)
  const total = Number(response.rows[0].total)
  const totalPages = Math.ceil(total / take)
  const nextPage = page + 1 === totalPages ? null : page + 2
  return { total, totalPages, nextPage, data }
}

export const getBooksFromInventoryIdPageComparison = async (
  id: number,
  take: number,
  page: number
): Promise<InventoryComparisonResponsePagination | null> => {
  try {
    const offset = page * take
    const firstQuery = `${getQuery(INVENTORY_BOOKS_QUERY)} OFFSET $2 LIMIT $3`
    const secondQuery = `${getQuery(
      `${INVENTORY_BOOKS_QUERY} ${INVENTORY_BOOKS_ORDER}`
    )} OFFSET $2 LIMIT $3`

    const queries = [
      pool.query(firstQuery, [id, offset, take]),
      pool.query(secondQuery, [id, offset, take]),
    ]
    const response = await Promise.all(queries)
    const total = Number(response[0].rows[0].total)
    const totalPages = Math.ceil(total / take)
    const nextPage = page + 1 === totalPages ? null : page + 2
    const [{ rows: currentBooks }, { rows: correctBooks }] = response
    const currentOrder = parseInventoriesBook(currentBooks)
    const correctOrder = parseInventoriesBook(correctBooks)
    const data = { currentOrder, correctOrder }
    return { total, totalPages, nextPage, data }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getSummaryBooksComparison = async (
  id: number,
  take: number
): Promise<InventorySummaryResponse | null> => {
  try {
    const firstQuery = INVENTORY_BOOKS_QUERY
    const secondQuery = `${INVENTORY_BOOKS_QUERY} ${INVENTORY_BOOKS_ORDER}`

    const queries = [
      pool.query(firstQuery, [id]),
      pool.query(secondQuery, [id]),
    ]
    const response = await Promise.all(queries)
    const pageSummary: any = []
    response[0].rows.forEach((libroCorrecto, index) => {
      const currentPage = Math.ceil((index + 1) / take)

      const actualEsIncorrecto =
        libroCorrecto.idejemplarinventariado !==
        response[1].rows[index].idejemplarinventariado

      if (actualEsIncorrecto) {
        // We know the book is incorrect, we should add it to the amount summary
        if (hasPropertyValue(pageSummary, 'page', currentPage)) {
          // Aumentar amount
          const pageIndex = pageSummary.findIndex(
            ({ page }: { page: number }) => currentPage === page
          )
          pageSummary[pageIndex].incorrectBooks++
        } else {
          // Empujar pagina
          pageSummary.push({ page: currentPage, incorrectBooks: 1 })
        }
      }
    })
    const total = response[0].rowCount
    const incorrectBooks = pageSummary.reduce(
      (value: number, { incorrectBooks }: { incorrectBooks: number }) =>
        incorrectBooks + value,
      0
    )
    const correctBooks = total - incorrectBooks
    return { total, incorrectBooks, correctBooks, data: pageSummary }
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getIsActive = async (id: number): Promise<boolean | null> => {
  const response = await pool.query(`
    SELECT activo FROM inventarios.inventarios WHERE idinventario = ${id}
`)
  if (response.rows.length === 0) return null
  const isActive = response.rows[0].activo
  return isActive
}
