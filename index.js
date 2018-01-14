import {
	graphqlExpress,
	graphiqlExpress
} from 'graphql-server-express'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'

const server = express()
const PORT = process.env.PORT || 5000

import { schema } from './schema'

server.use(cors())

server.use('/graphql', bodyParser.json(), graphqlExpress({
	schema
}))

console.log('domain', process.env.DOMAIN)

server.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
	subscriptionsEndpoint: `ws://graphql-coin.herokuapp.com/subscriptions`
}))

const ws = createServer(server)

ws.listen(PORT, () => {
  console.log(`GraphQL Server running at http://localhost:${PORT}`)

	new SubscriptionServer({
		execute,
		subscribe,
		schema
	}, {
		server: ws,
		path: '/subscriptions'
	})
})
