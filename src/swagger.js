const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' })

const outputFile = './swagger_output.json'
const endpointsFiles = ['./index.ts']

const doc = {
  info: {
    title: 'Books-API',
    description: 'A SIABUC API',
  },
  tags: [
    {
      name: 'Inventory',
      description: 'Endpoint to retrieve books from an inventory',
    },
    {
      name: 'Book',
      description: 'Endpoint to find a specific book',
    },
  ],
  components: {
    schemas: {
      Book: {
        id: 1460,
        acquisitionId: '495473',
        analyst: 'Julio',
        capturedDate: '2015-01-12T16:42:21.000Z',
        countedDate: '2015-01-12T16:42:48.000Z',
        copyId: '364933',
        classification: 'PQ7797 .A59 C37',
        bookDescription: {
          title: 'La carreta',
          isbn: '968-29-2229-1',
          author: 'Amorim, Enrique',
          publisher:
            'Secretaría de Educación Pública, Dirección General de Publicaciones y Medios',
        },
      },
      InventoryBooks: {
        isActive: false,
        total: 2865,
        totalPages: 29,
        nextPage: 2,
        data: [
          { $ref: '#/components/schemas/Book' },
          { $ref: '#/components/schemas/Book' },
          { $ref: '#/components/schemas/Book' },
        ],
      },
      Inventory: {
        id: 1,
        isoKey: '20140625101520',
        analyst: 'Admin',
        startDate: '2014-06-25T15:15:20.000Z',
        endDate: '2015-01-12T16:36:24.000Z',
        comments: 'none',
        active: false,
      },
      Inventories: {
        total: 1,
        data: [{ $ref: '#/components/schemas/Inventory' }],
      },
      LocationBook: {
        prevBooks: [{ $ref: '#/components/schemas/Book' }],
        currentBook: { $ref: '#/components/schemas/Book' },
        nextBooks: [{ $ref: '#/components/schemas/Book' }],
      },
      ComparisonBooks: {
        total: 200,
        totalPages: 5,
        nextPage: 2,
        data: {
          currentOrder: [{ $ref: '#/components/schemas/Book' }],
          correctOrder: [{ $ref: '#/components/schemas/Book' }],
        },
      },
      Summary: {
        total: 200,
        incorrectBooks: 199,
        correctBooks: 1,
        data: [{ page: 1, incorrectBooks: 100 }],
      },
    },
    parameters: {
      id: {
        name: 'id',
        in: 'path',
        description: 'Inventory ID',
        required: true,
        schema: {
          type: 'number',
        },
      },
      copyId: {
        name: 'copyId',
        in: 'path',
        description: 'Copy ID',
        required: true,
        schema: {
          type: 'number',
        },
      },
      inventory: {
        name: 'inventory',
        in: 'query',
        description: 'Inventory ID',
        required: true,
        schema: {
          type: 'number',
        },
      },
      page: {
        name: 'page',
        in: 'query',
        description: 'Page number, by default retrieve all without pagination',
        schema: {
          type: 'number',
        },
      },
      sizeOfPage: {
        name: 'sizeOfPage',
        in: 'query',
        description:
          'Total books per page, by default retrieve all without pagination',
        schema: {
          type: 'number',
        },
      },
      prevCount: {
        name: 'prevCount',
        in: 'query',
        description: 'Previous books to the specific book, by default is 2',
        schema: {
          type: 'number',
        },
      },
      nextCount: {
        name: 'nextCount',
        in: 'query',
        description: 'Next books to the specific book by, default is 2',
        schema: {
          type: 'number',
        },
      },
      ordered: {
        name: 'ordered',
        in: 'query',
        description: 'Retrieve books ordered by LCC',
        schema: {
          type: 'boolean',
        },
      },
      pageReq: {
        name: 'page',
        in: 'query',
        required: true,
        description: 'Page number',
        schema: {
          type: 'number',
        },
      },
      sizeOfPageReq: {
        name: 'sizeOfPage',
        in: 'query',
        required: true,
        description: 'Total books per page',
        schema: {
          type: 'number',
        },
      },
    },
  },
}

swaggerAutogen(outputFile, endpointsFiles, doc).catch((error) =>
  console.log(error)
)
