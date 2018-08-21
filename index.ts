import { ApolloServer, gql } from 'apollo-server';
import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'prisma/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

type User = {
  id: string;
  name: String;
  posts: [Post];
};

type Post = {
  id: string;
  title: String;
  published: Boolean;
  author: User;
};

const typeDefs = gql`
  type User {
    id: ID
    name: String
    posts: [Post]
  }

  type Post {
    id: ID
    title: String
    published: Boolean
    author: User
  }

  type Query {
    users: [User]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    users: (): Promise<User[]> => prisma.query.users({}, null, '{ id name }')
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
