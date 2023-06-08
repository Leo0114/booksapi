import express from 'express'
import { isNumberExist } from '../utils/inventory'
import { getPreviousAndNextBooks } from '../services/book'

const router = express.Router()

router.get('/:copyId', (req, res): any => {
  /* 	#swagger.tags = ['Book']
        #swagger.description = 'Endpoint to find a specific book' */
  /*	#swagger.parameters['$ref'] = [
        '#/components/parameters/copyId',
        '#/components/parameters/inventory',
        '#/components/parameters/prevCount',
        '#/components/parameters/nextCount'
      ] */
  /* #swagger.responses[200] = {
        description: 'Yada',
        schema: {$ref: '#components/schemas/LocationBook'}
} */
  const { prevCount = 2, nextCount = 2, inventory } = req.query
  const { copyId } = req.params
  if (!isNumberExist(copyId))
    return res.status(400).json({ message: 'Missing copyId' })
  if (!isNumberExist(inventory))
    return res.status(400).json({ message: 'Missing inventory' })

  const idNumber = Number(inventory)
  const prevCountNumber = Number(prevCount)
  const nextCountNumber = Number(nextCount)
  const copyIdNumber = Number(copyId)

  getPreviousAndNextBooks(
    idNumber,
    prevCountNumber,
    nextCountNumber,
    copyIdNumber
  )
    .then((response) => {
      res.status(200).json(response)
    })
    .catch((error) => {
      if (error instanceof Error && error.message === 'Not found')
        return res.sendStatus(404)
      return res.sendStatus(500)
    })
})

export default router
