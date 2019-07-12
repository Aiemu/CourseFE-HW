//initialize
const Koa = require('koa');
const app = new Koa();

//locate
const static = require('koa-static');
app.use(static('Aiemu.github.io'));
app.listen(8888);