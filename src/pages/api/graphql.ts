import { ApolloServer, gql } from "apollo-server-micro";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  addUserRecipe,
  createMenu,
  deleteMenu,
  getMenu,
  getMenus,
  getRecipe,
  removeUserRecipe,
  updateMenu,
} from "@/server/firestore";

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
    createMenu(name: String!, url: String): Menu
    updateMenu(id: Int!, name: String!, url: String): Menu
    deleteMenu(id: Int!): Menu
  }
`;

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
    deleteMenu: (_: undefined, args: any) => deleteMenu(args),
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
