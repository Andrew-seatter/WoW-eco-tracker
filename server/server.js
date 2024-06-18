const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    {
      requestDidStart(ctx) {
        return {
          didEncounterErrors(errors) {
            console.log(`*****\n⬇ Apollo error ⬇\n*****`)
            console.log(errors.source)
            console.log(errors.errors)
          }
        }
      }
    }
  ]
});

const User = require('./models/user')

const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // if we're in production, serve client/dist as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  } 

  db.once('open', async () => {
    try {
      
      // Quick test for creating and deleting a User instance
      const newUser = new User({
        username: 'testing user',
        email: 'testing@test.com',
        password: 'testingpassword'
      });

      await newUser.save();

      const createdUser = await User.find({username: 'testing user'});
      console.log('Created User: ', createdUser);

      const deletedUser = await User.findOneAndDelete({username: 'testing user'})

      console.log('Deleted User: ', deletedUser);

    } catch (error) {
      console.error(error);
    }


    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startApolloServer();
