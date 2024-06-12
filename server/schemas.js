const User = require('./models/user');
const Saved = require('./models/saved');
const PastSearch = require('./models/pastSearches');

module.exports= {
  typeDefs:
    `type User {
      _id: ID!
      username: String!
      email: String!
      saved: [Saved]
      pastSearches: [PastSearch]
    }

    type Saved {
      _id: ID!
    }

    type PastSearch {
      _id: ID!
    }

    type Query {
      getUserById(id: ID!): User
    }
  `,

  resolvers: {
    Query: {
      getUserById: async (_, { id }, { User }) => {
        return await User.findById(id);
      }
    },
    User: {
      saved: async (parent, _, { Saved }) => {
        return await Saved.find({ _id: { $in: parent.saved } });
      },
      pastSearches: async (parent, _, { PastSearch }) => {
        return await PastSearch.find({ _id: { $in: parent.pastSearches } });
      },
    }
  },
}
