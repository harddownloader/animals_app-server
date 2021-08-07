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
    phones: [String]!
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
    phones: [String]!
    car: String
    history: String
    whoGave: String,
    ktoDalTel: String
    jivoder: Boolean
  }
  type Query {
    getAllOwners: [Owner]
    getOwner(id: ID): Owner
  }
  type Mutation {
    createOwner(input: OwnerInput): Owner
  }

`);

module.exports = schema;
