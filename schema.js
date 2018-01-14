import { makeExecutableSchema } from 'graphql-tools'
import { resolvers } from './resolvers'

const typeDefs = `
type Coin {
	name: ID!
	displayName: String
	price: Float
	image: String
}
type Query {
	coins: [Coin]
}
type Subscription {
	priceChanged(name: ID!): Coin
}
`

const schema = makeExecutableSchema({ typeDefs,  resolvers })
export { schema }
