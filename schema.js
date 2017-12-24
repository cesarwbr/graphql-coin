import fetch from 'node-fetch'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat
} from 'graphql'

const BASE_URL = 'https://min-api.cryptocompare.com/data/pricemulti'

const CoinType = new GraphQLObjectType({
  name: 'Coin',
  description: '...',

  fields: () => ({
    USD: {
      type: GraphQLFloat,
      resolve: coin => coin.USD
    },
    BRL: {
      type: GraphQLFloat,
      resolve: coin => coin.BRL
    }
  })
})

const PriceType = new GraphQLObjectType({
  name: 'Price',
  description: '...',

  fields: () => ({
    BTC: {
      type: CoinType,
      resolve: price => price.BTC
    },
    ETH: {
      type: CoinType,
      resolve: price => price.ETH
    }
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    price: {
      type: PriceType,
      resolve: (root, args) =>
        fetch(`${BASE_URL}?fsyms=BTC,ETH&tsyms=USD,BRL`).then(res => res.json())
    }
  })
})

export default new GraphQLSchema({
  query: QueryType
})
