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

    expect(query).toContain('"operation_types":[2,3]')
    expect(query).toContain('"property_types":[2]')
    expect(query).toContain('"filters":[["room_amount","=",3]]')
    expect(query).toContain('"price_from":100000')
    expect(query).toContain('"price_to":200000')
    expect(query).toContain('&order_by=price')
    expect(query).toContain('&order=DESC')
  })

  it('should keep defaults when optional filters are missing', () => {
    const query = buildTokkoQuery({})

    expect(query).toContain('"operation_types":[1,2,3]')
    expect(query).toContain('"currency":"ANY"')
    expect(query).toContain('&order_by=')
    expect(query).toContain('&order=')
  })
})
