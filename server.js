
const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const mount = require("koa-mount");
const static = require('koa-static');
const bodyParser = require('koa-body');

const app = new Koa();
const router = new Router();


const didConfiguration = {
  "entries": {
    "did:foo:123": {
      "primary": true,
      "jwt": "BASE_64"
    },
    "did:bar:456": {
      "jwt": "BASE_64"
    }
  }
};

router.get('/', async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream('server/index.html');
  await next();
});

router.get('/.well-known/did-configuration', async (ctx, next) => {
  ctx.type = 'json';
  ctx.response.body = didConfiguration;
  await next();
});

router.post('/hub/:instance', async (ctx, next) => {
  if (ctx.params.instance == 'bar') {
    ctx.throw(503, 'Not Available');
  }
  else ctx.response.body = 'success';
  await next();
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(mount('/', static('./')))

app.listen(3000, () => {
  console.log(`Your app is running on port 3000`);
});
