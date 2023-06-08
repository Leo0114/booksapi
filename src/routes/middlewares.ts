import { NextFunction, Request, Response } from 'express'
import { isNumberExist } from '../utils/inventory'
import { getIsActive } from '../services/inventory'

export const inventoryActive = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const idNumber = Number(id)
    const isActive = await getIsActive(idNumber)
    if (isActive === null) {
      res.sendStatus(204)
      return
    }
    req.query.isActive = isActive ? 'true' : undefined
    req.query.id = id
    next()
  } catch (error) {
    if (error instanceof Error) res.sendStatus(500)
  }
}

export const pagination = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, sizeOfPage } = req.query
    const bothNotExist = !isNumberExist(page) && !isNumberExist(sizeOfPage)
    const bothExist = isNumberExist(page) && isNumberExist(sizeOfPage)
    if (bothNotExist) {
      next()
    } else if (bothExist) {
      req.query.page = String(Number(page) - 1)
      req.query.sizeOfPage = sizeOfPage
      next()
    } else if (isNumberExist(sizeOfPage)) {
      res.status(400).json({ message: 'Missing page' })
    } else {
      res.status(400).json({ message: 'Missing sizeOfPage' })
    }
  } catch (error) {
    if (error instanceof Error) res.sendStatus(500)
  }
}
