import { ApolloServer, gql } from 'apollo-server-micro'
import * as admin from 'firebase-admin'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Menu } from '@/types'

interface UserRecipe {
  id: number
  menuId: number
  userId: number
  createdAt: String
}

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

const typeDefs = gql`
  type Recipe {
    id: Int!
    menuId: Int!
    createdAt: String!
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

const getNewId = () => {
  const idNum = +new Date()
  const id = idNum.toString().slice(0, -3)
  return id
}

/**
 * Get user recipe list by email address
 * @param args
 * @returns
 */
const getRecipe = async (args: { email: string }) => {
  const userId = await getUserId(args.email)
  const userRecipes = await db.collection('recipes').where('userId', '==', userId).get()
  const buff: UserRecipe[] = []
  userRecipes.forEach((userRecipe) => buff.push(userRecipe.data() as UserRecipe))
  return buff
}

/**
 * Create user related menu
 * @param args
 * @returns
 */
const addUserRecipe = async (args: { email: string; menuId: number }) => {
  const userId = await getUserId(args.email)
  const id = getNewId()
  const docRef = db.collection('recipes').doc(id) as admin.firestore.DocumentReference<UserRecipe>
  const data = {
    id: +id,
    userId: userId,
    menuId: args.menuId,
    createdAt: new Date().toString(),
  }
  await docRef.set(data)
  return data
}

/**
 * Delete user's one recipe
 * @param args
 * @returns
 */
const removeUserRecipe = async (args: { recipeId: number }) => {
  const { recipeId } = args
  const docRef = db
    .collection('recipes')
    .doc(recipeId.toString()) as admin.firestore.DocumentReference<UserRecipe>
  const res = (await docRef.get()).data()
  await docRef.delete()
  return res
}

/**
 * Create Menu
 * @param args
 * @returns
 */
const createMenu = async (args: { name: string; url?: string }) => {
  const { name, url } = args
  const id = getNewId()
  const docRef = db.collection('menus').doc(id) as admin.firestore.DocumentReference<Menu>
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
  const docRef = db
    .collection('menus')
    .doc(id.toString()) as admin.firestore.DocumentReference<Menu>
  const data = {
    id,
    name,
    url: url || '',
  }
  await docRef.set(data)
  return data
}

/**
 * Get one menu
 * @param args
 * @returns
 */
const getMenu = async (args: { id: number }) => {
  const docRef = (await db
    .collection('menus')
    .doc(args.id.toString())) as admin.firestore.DocumentReference<Menu>
  const data = (await docRef.get()).data()
  return data
}

/**
 * Get All Menu
 * @returns
 */
const getMenus = async () => {
  const menus = await db.collection('menus').get()
  const buff: Menu[] = []
  menus.forEach((menu) => buff.push(menu.data() as Menu))
  return buff
}

const resolvers = {
  Query: {
    recipe: (_: undefined, args: any) => getRecipe(args),
    menu: (_: undefined, args: any) => getMenu(args),
    menus: () => getMenus(),
  },
  Mutation: {
    addUserRecipe: (_: undefined, args: any) => addUserRecipe(args),
    removeUserRecipe: (_: undefined, args: any) => removeUserRecipe(args),
    createMenu: (_: undefined, args: any) => createMenu(args),
    updateMenu: (_: undefined, args: any) => updateMenu(args),
  },
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
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
