export const INVENTORY_BOOKS_QUERY = `
      SELECT ROW_NUMBER() OVER() as index,
        count(*) OVER() AS total,
        idejemplarinventariado,
        ejemplaresinventariados.analista,
        ejemplaresinventariados.idejemplar,
        ejemplaresinventariados.no_adqui,
        fechacapturado, fechainventariado,
        fichas.clasificacion,
        fichas.isbn,
        fichas.autor,
        fichas.editorial,
        fichas.titulo 
      FROM analisis.ejemplares
      INNER JOIN analisis.fichas
      ON analisis.fichas.idficha = analisis.ejemplares.idficha
      INNER JOIN inventarios.ejemplaresinventariados
      ON inventarios.ejemplaresinventariados.idejemplar = analisis.ejemplares.idejemplar
      WHERE inventarios.ejemplaresinventariados.idinventario = $1
    `

export const INVENTORY_BOOKS_ORDER = `
      ORDER BY
        substring(fichas.clasificacion FROM '[A-Z]+'),
        CAST(substring(fichas.clasificacion FROM '[0-9.]+') AS FLOAT)
`
