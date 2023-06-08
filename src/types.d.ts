export interface Row {
  idinventario: number
  claveiso: string
  analista: string
  fechainicio: string
  fechafin: string
  comentarios: string
  activo: boolean
}

export interface Inventory {
  id: number
  isoKey: string
  analyst: string
  startDate: Date
  endDate: Date
  comments: string
  active: boolean
}

export interface RowBook {
  idejemplarinventariado: number
  analista: string
  idejemplar: string
  no_adqui: string
  fechacapturado: string
  fechainventariado: string
  clasificacion: string
  isbn: string
  titulo: string
  editorial: string
  autor: string
}

export interface BookDescription {
  isbn: string | null
  title: string
  author: string
  publisher: string
}

export interface InventoryBook {
  id: number
  analyst: string
  copyId: string
  acquisitionId: string
  capturedDate: Date
  countedDate: Date
  classification: string
  bookDescription: BookDescription
}

interface Response {
  total: number
}

interface ResponsePagination extends Response {
  totalPages: number
  nextPage: number | null
}

interface PageSummary {
  page: number
  incorrectBooks: number
}

export interface InventoryResponse extends Response {
  data: Inventory[]
}

export interface InventoryBookResponse extends Response {
  data: InventoryBook[]
}

export interface InventoryBookResponsePagination extends ResponsePagination {
  data: InventoryBook[]
}

export interface InventoryComparisonResponsePagination
  extends ResponsePagination {
  data: {
    currentOrder: InventoryBook[]
    correctOrder: InventoryBook[]
  }
}

export interface InventorySummaryResponse extends Response {
  incorrectBooks: number
  correctBooks: number
  data: PageSummary[]
}

export interface PreviousAndNextBooksResponse {
  prevBooks: InventoryBook[]
  currentBook: InventoryBook
  nextBooks: InventoryBook[]
}
