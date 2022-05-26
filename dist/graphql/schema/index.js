"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const graphql_1 = require("graphql");
exports.typeDefs = (0, graphql_1.buildSchema)(`
  
  type Owner {
    id: ID
    name: String
    adress: String
    photos: [String]
    phones: [String]
    history: String
    whoGave: String
    ktoDalTel: String
    jivoder: Boolean
    dateCreated: String
    dateUpdated: String
  }

  input OwnerInput {
    id: ID
    name: String
    adress: String
    photos: [String]
    phones: [String]
    history: String
    whoGave: String
    ktoDalTel: String
    jivoder: Boolean
  }

  input OwnerUpdateInput {
    id: ID
    name: String
    adress: String
    photos: [String]
    phones: [String]
    history: String
    whoGave: String
    ktoDalTel: String
    jivoder: Boolean
  }

  type User {
    id: ID
    fio: String
    email: String
    phone: String
    password: String
    idAddedOwnersHim: [String]!
  }

  input UserInput {
    id: ID
    fio: String
    email: String
    phone: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Query {
    getAllUsers: [User]
    getUser(id: ID): User
    getAllOwners: [Owner]
    getOwner(id: ID): Owner

    upOwnersByBackup: String
    

    refresh: String
    getTokens: String
    upsert: String
  }

  type Mutation {
    login(input: LoginInput!): AuthData
    
    createOwner(input: OwnerInput!): Owner
    updateOwner(input: OwnerUpdateInput!): Owner
    deleteOwner(id: String!): Owner

    createUser(input: UserInput!): User
    addOwnerIdToUser(ownerId: String!, userId: String!): User
  }

  type Subscription {
    newOwnersList: [Owner]
  }
`);
