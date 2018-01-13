import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const typeDefs = `
type Coin {
	name: ID!
	price: Float
}
type Query {
	coins: [Coin]
}
`

const schema = makeExecutableSchema({ typeDefs,  resolvers })
export { schema }
