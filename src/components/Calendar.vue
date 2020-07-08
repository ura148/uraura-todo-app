<template>
  <div>
    <h2>Today's ToDo</h2>
    <router-link to="/task">task</router-link>
    <!-- <button type="button" v-on:click="eyey()">eybtn</button> -->
    <template>
      <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id">
        <div class="card">
          <p>{{ key }}</p>
            <div v-for="(list, subkey) in taskCategory" :key="list.id" class="subcard">
              <p>{{list.name}}</p>
              <p>{{ list.achievementRate + "%完了" }}</p>
              <ul>
                <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id" class="todo">
                    <input v-if="subtodo.subDate == eyey()" type="checkbox" v-model="subtodo.isComplete">
                    <label v-if="subtodo.subDate == eyey()" v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                    <button v-if="subtodo.subDate == eyey()" type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
                </li>
              </ul>

              <div>
                <input type="text" v-model="newSubTodoName">
                <input type="date" v-model="subDeadline">
                <button type="button" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
              </div>
            </div>
        </div>
        <button type="submit" v-on:click="deleteLists(key)">削除</button>
      </div>

    </template>
</div>
</template>

<script>
import firebase from "firebase";

export default {
  name: 'calendar',
  data() {
    return {
      database: null,
      todosRef: null,
      newTodoName: "",
      newSubTodoName: "",
      deadline:"",
      subDeadline: "",
      showTodoType: "all",
      selected: '',
      options: [
        { text: 'private', value: 'private' },
        { text: 'recruit', value: 'recruit' },
        { text: 'bucket list', value: 'bucket list' }
      ],
      todos: [],
      dateList: [
        {ymd: '20190923', contents: ['髪を切る','面談','靴を買う']},
        {ymd: '20190914', contents: ['結婚式']},
        {ymd: '20190901', contents: ['妹の誕生日']},
        {ymd: '20190817', contents: ['海に行く！', '野球の練習']}
      ]
    }
  },
  created: function() {
    this.db = firebase.database();
    this.uid = firebase.auth().currentUser.uid;
    // refはreferenceでデータベースにある特定の項目を指し示すメソッド
    this.todosRef = this.db.ref("todos/" + this.uid);
    this.test = this.db.ref("todos/" + this.uid + "/")
    // データに変更があると実行されるfunction
    var _this = this;
    this.todosRef.on('value', function(snapshot) {
      _this.todos = snapshot.val(); // データに変化が起きたときに再取得する
    });
  },
  computed: {
    ey: function() {
      var today = new Date();
      today.setDate(today.getDate());
      var yyyy = today.getFullYear();
      var mm = ("0"+(today.getMonth()+1)).slice(-2);
      var dd = ("0"+today.getDate()).slice(-2);
      console.log(yyyy+'-'+mm+'-'+dd);
      let filterSubTodos = {};

      for (let key in this.todos) {
        let taskCategory = this.todos[key];
        for (let subkey in taskCategory) {
          let list = taskCategory[subkey];
          for (let subsubkey in list.subTasks) {
            let subtodo = list.subTasks[subsubkey];
            console.log(subtodo);
            filterSubTodos[subsubkey] = subtodo;
          }
        }
      }
      console.log(filterSubTodos);
      return filterSubTodos;
    },
    filteredTodos: function () {
      var showComplete = false;
      if (this.showTodoType == 'complete') {
        showComplete = true;
      }
      for (let key in this.todos) {
        let taskCategory = this.todos[key];
        // console.log(taskCategory);
        for (let subkey in taskCategory) {
          console.log(subkey);
          let list = taskCategory[subkey];
          // console.log(list);
          for (let subsubkey in list.subTasks) {
            let subtodo = list.subTasks[subsubkey];
            console.log(subtodo.subName);
            console.log(subsubkey);
             if (this.showTodoType == 'all') {
               subtodo.judge = true;
             }
              else if(subtodo.isComplete == showComplete) {
                subtodo.judge = true;
              }else {
                subtodo.judge = false;
              }
          }
        }
      }
      return this.todos;
    }
  },
  methods: {
     dateToYYYYMMDD: function(date) {
      let y = date.getFullYear()
      let m = ('00' + (date.getMonth()+1)).slice(-2)
      let d = ('00' + date.getDate()).slice(-2)
      let result = y + '' + m + '' + d
      return result
    },
    getContentFromKey: function(key) {
      const target = this.dateList.find((date) => {
        return (date.ymd === key)
      })
      return target.contents
    },
    eyey: function() {
      var today = new Date();
      today.setDate(today.getDate());
      var yyyy = today.getFullYear();
      var mm = ("0"+(today.getMonth()+1)).slice(-2);
      var dd = ("0"+today.getDate()).slice(-2);
      var ymd = (yyyy+'-'+mm+'-'+dd);
      // let filterSubTodos = {};
      console.log(ymd);
      return ymd;
    },
    deleteTodos: function(subkey, list, subsubkey) {
      this.todosRef.child(list.category).child(subkey).child("/subTasks").child(subsubkey).remove();
    },
    updateIsCompleteTodo: function(subkey, subtodo, list, subsubkey) {
      subtodo.isComplete = !subtodo.isComplete;
      var updates = {};
      updates[subsubkey] = subtodo;
      console.log(list);
      this.todosRef.child(list.category).child(subkey).child("/subTasks").update(updates)
    },

  }
}
</script>

<style scoped>
.cell-content {
  text-align:left;
  width: 70px;
  height: 50px;
  font-size: 50%;
  /* border: 1px solid #efefef; */
}
.cell-content-line {
  border-bottom: 1px solid #efefef;
}
</style>
