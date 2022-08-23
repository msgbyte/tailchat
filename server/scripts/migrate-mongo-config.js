// In this file you can configure migrate-mongo
// Reference: https://www.npmjs.com/package/migrate-mongo

require('ts-node').register();
const path = require('path');
const { config } = require('tailchat-server-sdk');

const migrateConfig = {
  mongodb: {
    // TODO Change (or review) the url to your MongoDB:
    url: config.mongoUrl,

    // TODO Change this to your database name:
    // databaseName: "YOURDATABASENAME",

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    },
  },

  // The migrations dir, can be an relative or absolute path. Only edit this when really necessary.
  migrationsDir: path.resolve(__dirname, 'migrations'),

  // The mongodb collection where the applied changes are stored. Only edit this when really necessary.
  changelogCollectionName: 'migrationlog',

  // The file extension to create migrations and search for in migration dir
  migrationFileExtension: '.ts',

  // Enable the algorithm to create a checksum of the file contents and use that in the comparison to determin
  // if the file should be run.  Requires that scripts are coded to be run multiple times.
  useFileHash: false,
};

// Return the config as a promise
module.exports = migrateConfig;
