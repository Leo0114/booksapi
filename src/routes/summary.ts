import express from 'express'
import { getSummaryBooksComparison } from '../services/inventory'
import { isNumberExist } from '../utils/inventory'
const router = express.Router()

router.get('/:id', (req, res): any => {
  /* 	#swagger.tags = ['Inventory']
      #swagger.description = 'Endpoint to retrieve a full summary of the incorrect books by pages' */
  /*	#swagger.parameters['$ref'] = [
        '#/components/parameters/id',
        '#/components/parameters/sizeOfPageReq'
        ] */
  /* #swagger.responses[200] = {
        description: 'Yada',
        schema: { $ref: '#/components/schemas/Summary' }
      } */
  const { sizeOfPage } = req.query
  const { id } = req.params
  if (!isNumberExist(sizeOfPage))
    return res.status(400).json({ message: 'Missing sizeOfPage' })
  const idNumber = Number(id)
  const sizeOfPageNumber = Number(sizeOfPage)
  getSummaryBooksComparison(idNumber, sizeOfPageNumber)
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((error) => {
      if (error instanceof Error) res.sendStatus(500)
    })
})

export default router
