import firebase from 'firebase'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'font-awesome/css/font-awesome.css';


Vue.use(VCalendar)
import VCalendar from 'v-calendar'

Vue.config.productionTip = false


  // Your web app's Firebase configuration
  const config = {
    apiKey: "AIzaSyBygb6LLmXowyMtZKRg2xayq876DWndPgQ",
    authDomain: "todo-list-test-da4c0.firebaseapp.com",
    databaseURL: "https://todo-list-test-da4c0.firebaseio.com",
    projectId: "todo-list-test-da4c0",
    storageBucket: "todo-list-test-da4c0.appspot.com",
    messagingSenderId: "829377406062",
    appId: "1:829377406062:web:563fe9e5c476dac3d1327f"
  };
  firebase.initializeApp(config);
  // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
