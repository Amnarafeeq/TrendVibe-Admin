import { type SchemaTypeDefinition } from 'sanity'
import { orderType } from './order'
import { productType } from './product'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [orderType,productType],
}
