// For vercel
// Reference: https://probot.github.io/docs/deployment/#vercel

const { createNodeMiddleware, createProbot } = require('probot');
const appFn = require('../../../src/app').appFn;

module.exports = createNodeMiddleware(appFn, {
  probot: createProbot(),
  webhooksPath: '/api/github/webhooks',
});
