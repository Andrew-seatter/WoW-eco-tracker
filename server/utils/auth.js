const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const SECRET_KEY = process.env.SECRET_KEY;

const authMiddleware = (req) => {
    const token = req.headers.authorization || '';
  
    if (!token) {
      throw new GraphQLError('Authentication token is missing');
    }
  
    try {

      const decoded = jwt.verify(token, SECRET_KEY);
      return { user: decoded };

    } catch (err) {

      switch (err.name) {
        case jwt.TokenExpiredError:
          throw new GraphQLError(`${err.message} : ${err.expiredAt}`);
        case jwt.JsonWebTokenError:
          throw new GraphQLError(`${err.message}`);
        case jwt.NotBeforeError:
          throw new GraphQLError(`${err.message} : ${err.date}`);
      }
      
    }
  };
  
  module.exports = { authMiddleware };