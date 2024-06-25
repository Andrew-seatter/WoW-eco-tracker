const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  UserNotFoundError: new GraphQLError('User not found.', {
    extensions: {
      code: 404
    }
  }),
  WrongPasswordError: new GraphQLError('Wrong password.', {
    extensions: {
      code: 401
    }
  }),
  CreateAlreadyTakenError: key => new GraphQLError(`${key} already taken`, {
    extensions: {
      code: 400
    }
  }),
  ShortPasswordError: new GraphQLError('Password does not meet minimum length requirement.', {
    extensions: {
      code: 400
    }
  }),
  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};