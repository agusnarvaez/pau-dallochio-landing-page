import { buildSanityQuery, buildTokkoQuery } from './filter-query.builder'
import { Filters } from './filters.service'

describe('filter-query.builder', () => {
  it('should build sanity query with operation type and type filters', () => {
    const filters: Filters = {
      operation_type: 'Venta',
      type: 'Casa',
    }

    const query = buildSanityQuery(filters)

    expect(query).toContain('*[_type == "property"')
    expect(query).toContain('operation_type->title == "Venta"')
    expect(query).toContain('type == "Casa"')
  })

  it('should build tokko query with mapped operation and property types', () => {
    const filters: Filters = {
      operation_type: 'Alquiler',
      type: 'Departamento',
      rooms: 3,
      minPrice: 100000,
      maxPrice: 200000,
      order_by: 'price',
      order: 'DESC',
    }

    const query = buildTokkoQuery(filters)
    const params = new URLSearchParams(query)
    const data = JSON.parse(params.get('data') ?? '{}')

    expect(query).not.toMatch(/[\n\r]/)
    expect(data.operation_types).toEqual([2, 3])
    expect(data.property_types).toEqual([2])
    expect(data.filters).toEqual([['room_amount', '=', 3]])
    expect(data.price_from).toBe(100000)
    expect(data.price_to).toBe(200000)
    expect(params.get('order_by')).toBe('price')
    expect(params.get('order')).toBe('DESC')
  })

  it('should keep defaults when optional filters are missing', () => {
    const query = buildTokkoQuery({})
    const params = new URLSearchParams(query)
    const data = JSON.parse(params.get('data') ?? '{}')

    expect(query).not.toMatch(/[\n\r]/)
    expect(data.operation_types).toEqual([1, 2, 3])
    expect(data.currency).toBe('ANY')
    expect(params.get('order_by')).toBe('')
    expect(params.get('order')).toBe('')
  })
})
