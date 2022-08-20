import { ApolloServer, gql } from 'apollo-server-micro'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const typeDefs = gql`
  type Recipe {
    id: ID!
    menu_id: Int!
    created_at: String!
  }

  type Menu {
    id: ID!
    name: String!
  }

  type Query {
    recipe(email: String!): [Recipe]
    menus: [Menu]
  }

  type Mutation {
    addUserRecipe(email: String!, menuId: Int!): Recipe
    createMenu(name: String!): Menu
    resetUserRecipe(email: String!): [Recipe]
  }
`

/**
 * ユーザー毎のレシピ取得
 * @param args
 * @returns
 */
const getRecipe = async (args: { email: string }) => {
  const { email } = args
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })
  return prisma.recipe.findMany({
    where: {
      user_id: user?.id,
    },
  })
}

const addUserRecipe = async (args: { email: string; menuId: number }) => {
  const { email } = args
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })
  return prisma.recipe.create({
    data: {
      user_id: user?.id ?? 0,
      menu_id: args.menuId,
    },
  })
}

const resetUserRecipe = async (args: { email: string }) => {
  const { email } = args
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  })
  return prisma.recipe.deleteMany({
    where: {
      user_id: user?.id,
    },
  })
}

/**
 * メニュー作成
 * @param args
 * @returns
 */
const createMenu = (args: { name: string }) =>
  prisma.menu.create({
    data: {
      name: args.name,
    },
  })

const resolvers = {
  Query: {
    recipe: (_: undefined, args: any) => getRecipe(args),
    menus: () => prisma.menu.findMany(),
  },
  Mutation: {
    addUserRecipe: (_: undefined, args: any) => addUserRecipe(args),
    createMenu: (_: undefined, args: any) => createMenu(args),
    resetUserRecipe: (_: undefined, args: any) => resetUserRecipe(args),
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
