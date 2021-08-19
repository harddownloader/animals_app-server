const { buildSchema } = require("graphql");

// phones: Array
/**
 * type User {
    id: ID
    fio: String
    email: String
    idAddedOwnersHim: [Owner]
  }
 */
const schema = buildSchema(`
  
  type Owner {
    id: ID
    name: String
    adress: String
    photoOwnerImage: String
    photoPasportImage: String
    phones: [String]
    car: String
    history: String
    whoGave: String,
    ktoDalTel: String
    jivoder: Boolean
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
    whoGave: String,
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
    whoGave: String,
    ktoDalTel: String
    jivoder: Boolean
  }

  type User {
    id: ID
    fio: String
    email: String
    idAddedOwnersHim: [String]!
  }

  type Query {
    getAllUsers: [User]
    getUser(id: ID): User
    getAllOwners: [Owner]
    getOwner(id: ID): Owner

    upOwnersByBackup: String
    currentNumber: Int

    addOwnerEvent: Owner
    createOwnerQuery: Owner
  }

  type Mutation {
    createOwner(input: OwnerInput!): Owner
    updateOwner(input: OwnerUpdateInput!): Owner
    deleteOwner(id: String!): Owner

    
  }


  
  type Subscription {
    numberIncremented: Int
    
    postCreated: Owner
    newOwnersList: [Owner]
  }

`);

module.exports = schema;
// export schema


