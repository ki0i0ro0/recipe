import { ApolloServer, gql } from 'apollo-server-micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const typeDefs = gql`
  type Recipe {
    id: ID!
    data: String
  }

  type Query {
    recipe(email: String!): Recipe
  }

  type Mutation {
    updateRecipe(id: Int!, data: String): Recipe
  }
`

const getRecipe = async (args: { email: string }) => {
  const { email } = args
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  return prisma.recipe.findFirst({
    where: {
      user_id: user?.id,
    },
  })
}

const resolvers = {
  Query: {
    recipe: (_: undefined, args: any) => getRecipe(args),
  },
  Mutation: {
    updateRecipe: (_: undefined, args: any) => {
      return prisma.recipe.update({
        where: {
          id: args.id,
        },
        data: {
          data: args.data,
        },
      })
    },
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
})

const startServer = apolloServer.start()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', 'https://studio.apollographql.com')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  if (req.method === 'OPTIONS') {
    res.end()
    return false
  }

  await startServer
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}
