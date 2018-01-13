import {
	graphqlExpress,
	graphiqlExpress
} from 'graphql-server-express'
import bodyParser from 'body-parser'
import express from 'express'

const server = express()

import { schema } from './schema'

server.use('/graphql', bodyParser.json(), graphqlExpress({
	schema
}))

server.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql'
}))

server.listen(process.env.PORT || 5000, () =>
  console.log('GraphQL Server running at http://localhost:5000')
)
