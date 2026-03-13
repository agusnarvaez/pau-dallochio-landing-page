import { Filters } from './filters.service'

type FilterCondition = [string, '=', string | number]

interface TokkoQuery {
  current_localization_id: number
  current_localization_type: string
  price_from: number
  price_to: number
  operation_types: number[]
  property_types: number[]
  currency: string
  filters: FilterCondition[]
}

const DEFAULT_TOKKO_QUERY: TokkoQuery = {
  current_localization_id: 0,
  current_localization_type: 'country',
  price_from: 0,
  price_to: 999999999,
  operation_types: [1, 2, 3],
  property_types: [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25,
  ],
  currency: 'ANY',
  filters: [],
}

const SANITY_QUERY_PROJECTION = `{
      ...,
      operation_type->{
          title
      },
      currency->{
          title
      },
      type->{
          title
      },
      images[]{
          asset->{
              path, url
          }
      },
      cover{
          asset->{
              path, url
          }
      }
    }`

export const buildSanityQuery = (filters: Filters): string => {
  const baseQuery = '*[_type == "property"'
  const filterQuery = Object.keys(filters)
    .map((key) => {
      const value = filters[key]
      if (typeof value === 'boolean' && value) {
        return ` && ${key} == true`
      }

      if (typeof value === 'string') {
        if (value === 'Venta' || value === 'Alquiler') {
          return ` && operation_type->title == "${value}"`
        }

        return ` && ${key} == "${value}"`
      }

      return ''
    })
    .join('')

  return `${baseQuery}${filterQuery}]${SANITY_QUERY_PROJECTION}`
}

export const buildTokkoQuery = (filters: Filters): string => {
  const baseQuery: TokkoQuery = {
    ...DEFAULT_TOKKO_QUERY,
    operation_types: [...DEFAULT_TOKKO_QUERY.operation_types],
    property_types: [...DEFAULT_TOKKO_QUERY.property_types],
    filters: [],
  }

  let orderBy: string | number | true = ''
  let order: string | number | true = ''

  if (filters.operation_type === 'Venta') baseQuery.operation_types = [1]
  if (filters.operation_type === 'Alquiler') baseQuery.operation_types = [2, 3]

  if (typeof filters.rooms === 'number' && filters.rooms > 0) {
    baseQuery.filters.push(['room_amount', '=', filters.rooms])
  }

  if (filters.type === 'Departamento') baseQuery.property_types = [2]
  else if (filters.type === 'Casa') baseQuery.property_types = [3]
  else if (filters.type === 'PH') baseQuery.property_types = [13]

  if (filters.minPrice) baseQuery.price_from = Number(filters.minPrice)
  if (filters.maxPrice) baseQuery.price_to = Number(filters.maxPrice)

  if (filters.order_by) orderBy = filters.order_by
  if (filters.order) order = filters.order

  return `data=${JSON.stringify(baseQuery)}
            &order_by=${orderBy}
            &order=${order}`
}
