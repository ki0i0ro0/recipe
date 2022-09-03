import { PrismaClient } from '@prisma/client'
import { ApolloServer, gql } from 'apollo-server-micro'
import * as admin from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // cert()の中に直接JSON形式で代入
      projectId: process.env.FSA_PROJECT_ID,
      privateKey: (process.env.FSA_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FSA_CLIENT_EMAIL,
    }),
  })
}

const db = admin.firestore()

const prisma = new PrismaClient()

const typeDefs = gql`
  type Recipe {
    id: Int!
    menu_id: Int!
    created_at: String!
  }

  type Menu {
    id: Int!
    name: String!
    url: String
  }

  type Query {
    recipe(email: String!): [Recipe]
    menu(id: Int!): Menu
    menus: [Menu]
  }

  type Mutation {
    addUserRecipe(email: String!, menuId: Int!): Recipe
    removeUserRecipe(email: String!, recipeId: Int!): Recipe
    createMenu(name: String!, url: String!): Menu
    updateMenu(id: Int!, name: String!, url: String!): Menu
    resetUserRecipe(email: String!): [Recipe]
  }
`

/**
 * Get user's id by email address
 * @param email
 * @returns
 */
const getUserId = async (email: string) => {
  const userRef = db.collection('users').doc(email)
  const doc = await userRef.get()
  return doc.exists ? doc.data()?.id : 0
}

/**
 * Get user recipe list by email address
 * @param args
 * @returns
 */
const getRecipe = async (args: { email: string }) => {
  const userId = await getUserId(args.email)
  return prisma.recipe.findMany({
    where: {
      user_id: userId,
    },
  })
}

/**
 * Create user related menu
 * @param args
 * @returns
 */
const addUserRecipe = async (args: { email: string; menuId: number }) => {
  const userId = await getUserId(args.email)
  return prisma.recipe.create({
    data: {
      user_id: userId,
      menu_id: args.menuId,
    },
  })
}

/**
 * Delete user's one recipe
 * @param args
 * @returns
 */
const removeUserRecipe = async (args: { recipeId: number }) => {
  const { recipeId } = args
  const recipeRef = db.collection('recipes').doc(recipeId.toString())
  const res = (await recipeRef.get()).data()
  await recipeRef.delete()
  return res
}

/**
 * Delete user's all recipe
 * @param args
 * @returns
 */
const resetUserRecipe = async (args: { email: string }) => {
  const userId = await getUserId(args.email)
  return prisma.recipe.deleteMany({
    where: {
      user_id: userId,
    },
  })
}

/**
 * Create Menu
 * @param args
 * @returns
 */
const createMenu = async (args: { name: string; url?: string }) => {
  const { name, url } = args
  const idNum = +new Date()
  const id = idNum.toString().slice(0, -3)
  const docRef = db.collection('menus').doc(id)
  const data = {
    id: +id,
    name,
    url: url || '',
  }
  await docRef.set(data)
  return data
}

/**
 * Update Menu
 * @param args
 * @returns
 */
const updateMenu = async (args: { id: number; name: string; url: string }) => {
  const { id, name, url } = args
  const docRef = db.collection('menus').doc(id.toString())
  const data = {
    id,
    name,
    url: url || '',
  }
  await docRef.set(data)
  return data
}

/**
 * Get All Menu
 * @returns
 */
const getMenus = async () => {
  const menus = await db.collection('menus').get()
  const buff: { id: number; name: string; url: string }[] = []
  menus.forEach((menu) => buff.push(menu.data() as { id: number; name: string; url: string }))
  return buff
}

const resolvers = {
  Query: {
    recipe: (_: undefined, args: any) => getRecipe(args),
    menu: (_: undefined, args: any) => prisma.menu.findFirst({ where: { id: args.id } }),
    menus: () => getMenus(),
  },
  Mutation: {
    addUserRecipe: (_: undefined, args: any) => addUserRecipe(args),
    removeUserRecipe: (_: undefined, args: any) => removeUserRecipe(args),
    createMenu: (_: undefined, args: any) => createMenu(args),
    updateMenu: (_: undefined, args: any) => updateMenu(args),
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
