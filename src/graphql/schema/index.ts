import { buildSchema } from "graphql";

export const typeDefs = buildSchema(`
  
  type Owner {
    id: ID
    name: String
    adress: String
    photoOwnerImage: String
    photoPasportImage: String
    phones: [String]
    car: String
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
    photoOwnerImage: String
    photoPasportImage: String
    phones: [String]
    car: String
    history: String
    whoGave: String
    ktoDalTel: String
    jivoder: Boolean
  }

  input OwnerUpdateInput {
    id: ID
    name: String
    adress: String
    photoOwnerImage: String
    photoPasportImage: String
    phones: [String]
    car: String
    history: String
    whoGave: String
    ktoDalTel: String
    jivoder: Boolean
  }

  type User {
    id: ID
    fio: String
    email: String
    idAddedOwnersHim: [String]!
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
    login(email: String!, password: String!): AuthData!
  }

  type Mutation {
    createOwner(input: OwnerInput!): Owner
    updateOwner(input: OwnerUpdateInput!): Owner
    deleteOwner(id: String!): Owner

    addOwnerIdToUser(ownerId: String!, userId: String!): User
  }

  type Subscription {
    newOwnersList: [Owner]
  }
`);
