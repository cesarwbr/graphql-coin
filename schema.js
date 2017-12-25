import fetch from 'node-fetch'
import moment from 'moment'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt
} from 'graphql'

const BASE_URL = 'https://min-api.cryptocompare.com/data'

const HisType = new GraphQLObjectType({
  name: 'His',
  description: '...',

  fields: () => ({
    time: {
      type: GraphQLString,
      resolve: root => moment(root.time * 1000).format('L')
    },
    value: {
      type: GraphQLFloat,
      resolve: root => root.open
    }
  })
})

const PriceType = new GraphQLObjectType({
  name: 'Prince',
  description: '...',

  fields: () => ({
    actualValue: {
      type: GraphQLFloat,
      resolve: price => price.value
    },
    histoday: {
      type: GraphQLList(HisType),
      resolve: price =>
        fetch(
          `${BASE_URL}/histoday?fsym=${price.coin}&tsym=${
            price.type
          }&limit=30&aggregate=1`
        )
          .then(res => res.json())
          .then(result => result.Data)
    }
  })
})

const CoinType = new GraphQLObjectType({
  name: 'Coin',
  description: '...',

  fields: () => ({
    USD: {
      type: PriceType,
      resolve: coin => ({ value: coin.value.USD, coin: coin.type, type: 'USD' })
    },
    BRL: {
      type: PriceType,
      resolve: coin => ({ value: coin.value.BRL, coin: coin.type, type: 'BRL' })
    }
  })
})

const CoinsType = new GraphQLObjectType({
  name: 'Coins',
  description: '...',

  fields: () => ({
    BTC: {
      type: CoinType,
      resolve: price => ({ value: price.BTC, type: 'BTC' })
    },
    ETH: {
      type: CoinType,
      resolve: price => ({ value: price.ETH, type: 'ETH' })
    }
  })
})

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({
    price: {
      type: CoinsType,
      resolve: (root, args) =>
        fetch(`${BASE_URL}/pricemulti?fsyms=BTC,ETH&tsyms=USD,BRL`).then(res =>
          res.json()
        )
    }
  })
})

export default new GraphQLSchema({
  query: QueryType
})
