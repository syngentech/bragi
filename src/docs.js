import Vue from 'vue'
import Router from 'vue-router'

// Install router
Vue.use(Router)

// Routing
var router = new Router()

router.map({
  '/amazeui': {
    component: require('./amazeui/docs.vue')
  },
  '/plasmid': {
    component: require('./plasmid/docs.vue')
  },
  '/status-progressbar': {
    component: require('./status-progressbar/docs.vue')
  },
  '/sunburst': {
    component: require('./sunburst/docs.vue')
  }
})

router.redirect({
  '*': '/amazeui'
})

router.start(require('./docs.vue'), '#app')
