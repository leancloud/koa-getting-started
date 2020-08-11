'use strict';

const path = require('path');

const AV = require('leanengine');
const Koa = require('koa');
const Router = require('koa-router');
const views = require('koa-views');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');

// Loads cloud function definitions.
// You can split it into multiple files but do not forget to load them in the main file.
require('./cloud');

const app = new Koa();

// Configures template engine.
app.use(views(path.join(__dirname, 'views')));

// Configures static resources directory.
app.use(statics(path.join(__dirname, 'public')));

const router = new Router();
app.use(router.routes());

// Loads LeanEngine middleware.
app.use(AV.koa());

app.use(bodyParser());

router.get('/', async function(ctx) {
  ctx.state.currentTime = new Date();
  await ctx.render('./index.ejs');
});

// You can store routings in multiple files according to their categories.
app.use(require('./routes/todos').routes());

module.exports = app;
