import {
  BookDescription,
  Inventory,
  InventoryBook,
  Row,
  RowBook,
} from '../types'

const isString = (string: string): boolean => {
  return typeof string === 'string'
}

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date))
}

const isNumber = (number: string): boolean => {
  return !isNaN(Number(number))
}

const isBoolean = (boolean: boolean): boolean => {
  return typeof boolean === 'boolean'
}

const parseId = (idFromRequest: any): number => {
  if (!isNumber(idFromRequest)) {
    throw new Error('Incorrect id from request')
  }
  return idFromRequest
}

const parseDate = (dateFromRequest: any): Date => {
  if (!isDate(dateFromRequest)) {
    throw new Error('Incorrect date from request')
  }
  return new Date(dateFromRequest)
}

const parseString = (stringFromRequest: any): string => {
  if (!isString(stringFromRequest)) {
    return ''
  }
  return stringFromRequest
}

const parseBoolean = (booleanFromRequest: any): boolean => {
  if (!isBoolean(booleanFromRequest)) {
    if (!isString(booleanFromRequest)) {
      throw new Error('Incorrect boolean from request')
    }
    return booleanFromRequest === 'true'
  }
  return booleanFromRequest
}

export const isNumberExist = (number: any): boolean => {
  if (number === undefined || number === '') return false
  if (!isString(number)) return false
  if (!isNumber(number)) return false
  return true
}

export const parsePositiveNumber = (number: number): number | false => {
  if (Number(number) < 0) return false
  return number
}

export const parseInventories = (rows: Row[]): Inventory[] => {
  const getDate = (date: string, active?: boolean): Date => {
    if (active === false || active === undefined) return parseDate(date)
    return new Date()
  }
  const data: Inventory[] = rows.map((row) => ({
    id: parseId(row.idinventario),
    isoKey: parseString(row.claveiso),
    analyst: parseString(row.analista),
    startDate: parseDate(row.fechainicio),
    endDate: getDate(row.fechafin, row.activo),
    comments: parseString(row.comentarios),
    active: parseBoolean(row.activo),
  }))

  return data
}

export const parseInventoryBook = (row: RowBook): InventoryBook => {
  const bookDescription: BookDescription = {
    title: parseString(row.titulo),
    isbn: parseString(row.isbn),
    author: parseString(row.autor),
    publisher: parseString(row.editorial),
  }
  return {
    id: parseId(row.idejemplarinventariado),
    acquisitionId: parseString(row.no_adqui),
    analyst: parseString(row.analista),
    capturedDate: parseDate(row.fechacapturado),
    countedDate: parseDate(row.fechainventariado),
    copyId: parseString(row.idejemplar),
    classification: parseString(row.clasificacion),
    bookDescription,
  }
}

export const parseInventoriesBook = (rows: RowBook[]): InventoryBook[] => {
  const data: InventoryBook[] = rows.map(parseInventoryBook)

  return data
}

export const hasPropertyValue = (
  array: any[],
  propertyName: string,
  value: number
): boolean => {
  for (const item of array) {
    if (item[propertyName] === value) {
      return true
    }
  }
  return false
}

export const getQuery = (query: string): string =>
  `WITH ordered AS (${query}) SELECT * FROM ordered`
