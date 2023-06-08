import express, { RequestHandler } from 'express'
import {
  getBooksFromInventoryId,
  getBooksFromInventoryIdPage,
  getInventories,
} from '../services/inventory'
import { inventoryActive, pagination } from './middlewares'
import comparison from './comparison'
import summary from './summary'

const router = express.Router()

router.use('/comparison', comparison)
router.use('/summary', summary)

router.get('/', (_req, res): void => {
  /* 	#swagger.tags = ['Inventory']
      #swagger.description = 'Endpoint to retrieve all inventories' */
  /* #swagger.responses[200] = {
        description: 'Yada',
        schema: { $ref: '#/components/schemas/Inventories' }
} */
  getInventories()
    .then((response) => {
      res.status(200).json(response)
    })
    .catch(() => res.sendStatus(500))
})

router.get(
  '/:id',
  inventoryActive as RequestHandler,
  pagination as RequestHandler,
  (async (req, res): Promise<void> => {
    /* 	#swagger.tags = ['Inventory']
        #swagger.description = 'Endpoint to retrieve books from an inventory' */
    /*	#swagger.parameters['$ref'] = [
        '#/components/parameters/id',
        '#/components/parameters/page',
        '#/components/parameters/sizeOfPage',
        '#/components/parameters/ordered'
        ] */
    /* #swagger.responses[200] = {
        description: 'Yada',
        schema: { $ref: '#/components/schemas/InventoryBooks' }
} */
    const { id, isActive, sizeOfPage, page, ordered } = req.query
    const idNumber = Number(id)
    const sizeOfPageNumber = Number(sizeOfPage)
    const pageNumber = Number(page)
    const isPagination = sizeOfPage !== undefined && page !== undefined
    const isOrdered = ordered === 'true'
    try {
      const response = isPagination
        ? await getBooksFromInventoryIdPage(
          idNumber,
          sizeOfPageNumber,
          pageNumber,
          isOrdered
        )
        : await getBooksFromInventoryId(idNumber, isOrdered)
      res.status(200).json({ isActive: Boolean(isActive), ...response })
    } catch (error: unknown) {
      if (error instanceof Error) res.sendStatus(500)
    }
  }) as RequestHandler
)

export default router
