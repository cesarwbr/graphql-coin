import express from 'express'
import graphQLHTTP from 'express-graphql'

import schema from './schema'

const app = express()

app.use(
  graphQLHTTP({
    schema,
    graphiql: true
  })
)

app.listen(process.env.PORT || 5000, () =>
  console.log('GraphQL Server running at http://localhost:5000')
)
