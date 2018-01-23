import Vue from 'vue'
import Router from 'vue-router'
import ListeVideo from '@/components/ListeVideo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ListeVideo',
      component: ListeVideo
    }
  ]
})
