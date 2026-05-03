import "dotenv/config";
import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { createContext } from "./context/context";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
});


server.listen({ 
    port: 4000,
    cors: {
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    },
 }).then(({ url }) => {
  console.log(`Server rodando em ${url}`);
});