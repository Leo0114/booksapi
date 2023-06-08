import express, { RequestHandler } from 'express'
import { pagination } from './middlewares'
import { getBooksFromInventoryIdPageComparison } from '../services/inventory'
import { isNumberExist } from '../utils/inventory'
const router = express.Router()

router.get('/:id', pagination as RequestHandler, (req, res): any => {
  /* 	#swagger.tags = ['Inventory']
      #swagger.description = 'Endpoint to retrieve a comparison of the current order and correct order' */
  /*	#swagger.parameters['$ref'] = [
        '#/components/parameters/id',
        '#/components/parameters/pageReq',
        '#/components/parameters/sizeOfPageReq'
        ] */
  /* #swagger.responses[200] = {
        description: 'Yada',
        schema: { $ref: '#/components/schemas/ComparisonBooks' }
      } */
  const { sizeOfPage, page } = req.query
  const { id } = req.params
  if (!isNumberExist(sizeOfPage))
    return res.status(400).json({ message: 'Missing sizeOfPage' })
  if (!isNumberExist(page))
    return res.status(400).json({ message: 'Missing page' })
  const idNumber = Number(id)
  const sizeOfPageNumber = Number(sizeOfPage)
  const pageNumber = Number(page)
  getBooksFromInventoryIdPageComparison(idNumber, sizeOfPageNumber, pageNumber)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((error) => {
      if (error instanceof Error) res.sendStatus(500)
    })
})

export default router
