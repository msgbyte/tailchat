const app = require('express')();
const { v4 } = require('uuid');
const { createProbot } = require('probot');
const { appFn, buildRouter } = require('../src/app');

const probot = createProbot();
probot.load(appFn, {
  getRouter: (path) => app,
});

module.exports = app;
