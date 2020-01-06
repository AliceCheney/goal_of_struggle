import Vue from 'vue'
import Router from 'vue-router'  //这里引用了vue-router 并且用Vue.use来使用Router
const goal = ()=> import('./components/goal');
const index = ()=> import('./components/index');
const myGoal = ()=> import('./components/MyGoal');

Vue.use(Router);

// Router的内置属性
export default new Router({
    mode: 'hash',  //要使用hash模式还是 history模式 我们一般情况下还是用 hash模式 history在后台支持的情况下可以开启
    base: process.env.BASE_URL,  // 应用的基路径。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
    routes: [              //这就是真正写路由的地方了
        {
            path: '/goal',        //  当路由是/的时候 我们匹配哪个组件(这里是Home.vue)
            name: 'goal',
            component: goal,
            meta:{
                title:'更新目标'
            }
        },
        {
            path: '/MyGoal',
            name:'myGoal',
            component:myGoal,
            meta:{
                title:'我的目标'
            }
        },
        {
            path: '/index',
            name:'index',
            component:index,
            meta:{
                title:'奋斗目标'
            }
        },
        {
            path: '/',
            name:'index',
            component:index,
            meta:{
                title:'奋斗目标'
            }
        }
    ]
})