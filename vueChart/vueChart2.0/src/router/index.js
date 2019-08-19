import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Chart from '@/components/chart'

Vue.use(Router)

export default new Router({
  routes: [
/*    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },*/
    {
      path:'/',
      name:'chart',
      component:Chart
    }
  ]
})
