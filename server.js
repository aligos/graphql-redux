const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const graphqlHTTP = require('express-graphql');
const graphql = require('graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;
const goldbergs = require('./data');
const config = require('./webpack.config.js');

// graphql type
const goldbergType = new GraphQLObjectType({
  name: "Goldberg",
  description: "Member of The Goldbergs",
  fields: {
   character: {
     type: GraphQLString,
     description: "Name of the character",
   },
   actor: {
     type: GraphQLString,
     description: "Actor playing the character",
   },
   role: {
     type: GraphQLString,
     description: "Family role"
   },
   traits: {
     type: GraphQLString,
     description: "Traits this Goldberg is known for"
   },
   id: {
     type: GraphQLInt,
     description: "ID of this Goldberg"
   }
 }
});

// query type
const queryType = new GraphQLObjectType({
  name: "query",
  description: "Goldberg query",
  fields: {
    goldberg: {
      type: goldbergType,
      args: {
        id: {
          type: GraphQLInt
        }
      },
      resolve: function(_, args){
        return getGoldberg(args.id)
      }
    }
  }
});

// fetch data from data.js
function getGoldberg(id) {
 return goldbergs[id]
}

// schema
const schema = new GraphQLSchema({
 query: queryType
});

// run graphql server 
const graphQLServer = express();
graphQLServer.use(cors());
graphQLServer.use(compression());
graphQLServer.use('/', graphqlHTTP({ schema: schema, graphiql: true }));
graphQLServer.listen(8080);
console.log("The GraphQL Server is running.")

const compiler = webpack(config);
const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${8080}`},
  publicPath: '/static/',
  stats: {colors: true}
});

// Serve static resources
app.use('/', express.static('static'));
app.listen(3000);
console.log("The App Server is running.")
