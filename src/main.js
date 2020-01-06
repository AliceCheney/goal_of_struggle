import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue'
import App from './App.vue'
import { Button,Radio, RadioGroup, RadioButton, Menu, Submenu, MenuItem, MenuItemGroup,Input, InputNumber,
Carousel, CarouselItem,Timeline, TimelineItem,Card,DatePicker, TimePicker,TimeSelect,Dialog,Form, FormItem,
Option,Message,Avatar,Row,Col,Progress,Rate,Backtop} from 'element-ui';
import router from './router'
import store from './store'

Vue.use(Radio);
Vue.use(Backtop);
Vue.use(Rate);
Vue.use(Col);
Vue.use(Progress);
Vue.use(Row);
Vue.use(Avatar);
Vue.prototype.$message = Message;
Vue.use(Dialog);
Vue.use(Option);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(TimeSelect);
Vue.use(Card);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.meta.title){
    document.title = to.meta.title
  }
  next()
});

new Vue({
  router,   //
  store,
  el: '#app',
  components: {App},
  render: h => h(App)
});