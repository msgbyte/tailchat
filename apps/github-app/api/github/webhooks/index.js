// For vercel
// Reference: https://probot.github.io/docs/deployment/#vercel

const { createNodeMiddleware, createProbot } = require('probot');
const app = require('../../../src/app').app;

module.exports = createNodeMiddleware(app, {
  probot: createProbot(),
  webhooksPath: '/api/github/webhooks',
});
