'use strict';

const AV = require('leanengine');
const Router = require('koa-router');

const router = new Router({prefix: '/todos'});

const Todo = AV.Object.extend('Todo');

// Todo list
router.get('/', async function(ctx) {
  ctx.state.title = 'TODO 列表';
  const query = new AV.Query(Todo);
  query.descending('createdAt');
  try {
    ctx.state.todos = await query.find();
  } catch (err) {
    if (err.code === 101) {
      // Todo class does not exist in the cloud yet.
      ctx.state.todos = [];
    } else {
      throw err;
    }
  }
  await ctx.render('todos.ejs');
});

// Creates a new todo item.
router.post('/', async function(ctx) {
  const content = ctx.request.body.content;
  console.log(content);
  ctx.body = content;
  var todo = new Todo();
  todo.set('content', content);
  await todo.save();
  ctx.redirect('/todos');
});

module.exports = router;
