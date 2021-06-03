import "@babel/polyfill";
import Vue from "vue";
import App from "../../example/exam.vue";
import ElementUi from "element-ui";
Vue.use(ElementUi);
new Vue({
  el: "#app",
  render: (h) => h(App),
});
