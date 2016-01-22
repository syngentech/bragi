/*
  Bragi Docs
*/
var Vue = require('vue');
var Router = require('vue-router');

// Install router
Vue.use(Router);

// Routing
var router = new Router();

router.map({
  '/amazeui': {
    component: require('./amazeui/docs.vue')
  }
});

router.redirect({
  '*': '/amazeui'
});

router.start(require('./docs.vue'), '#app');
