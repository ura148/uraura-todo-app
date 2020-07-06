<template>
  <div class="task">
     <h2>タスク</h2>
    <div>
      <!-- 初期はVーmodelで"newTodoName"を入れているが空白、故にタスク作った後に空白にしないとミスが起こる -->
      <input type="text" v-model="newTodoName">
      <input type="date" v-model="deadline">
      <select v-model="selected">
        <option v-for="option in options" v-bind:value="option.value" :key="option.id">
          {{ option.text }}
        </option>
      </select>
      <!-- <select name="blood">
        <option value="A">A型</option>
        <option value="B">B型</option>
        <option value="O">O型</option>
        <option value="AB">AB型</option>
      </select> -->
      <!-- <button type="submit" v-on:click="createList()">タスク作成</button> -->
      <button type="submit" v-on:click="createTodo()">リスト作成</button>
    </div>
    <ul>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'">すべて</button></li>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'">未完タスク一覧</button></li>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'">完了タスク一覧</button></li>
    </ul>


    <!-- todoの一覧表示 -->
    <p>{{ taskNumber + "個のタスク" }}</p>

    <ul v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id">
      <li class="card">
        <p>{{ key }}</p>
        <div class="">
          <!-- <input type="checkbox" v-model="todo.isComplete" v-on:click="updateIsCompleteTodo(todo, key)"> -->


          <div v-for="(list, subkey) in taskCategory" :key="list.id">
            <p>{{list.name}}</p>
            <div v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
              <div v-if="subtodo.judge == true">
                <p>{{subtodo.subName}}</p>
                <input type="checkbox" v-model="subtodo.isComplete" v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">
              </div>
            </div>


            <div>
              <input type="text" v-model="newSubTodoName">
              <input type="date" v-model="subDeadline">
              <button type="submit" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
            </div>
          </div>
        </div>
      </li>
      <button type="submit" v-on:click="deleteTodo(key)">削除</button>
    </ul>



    <ul>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'private'">private</button></li>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'recruit'">recruit</button></li>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'beforeIDie'">bucket list</button></li>
    </ul>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Task",
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
      todos: []
    };
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
    // filteredTodos: function () {
    //   var showComplete = false;
    //   if (this.showTodoType == 'complete') {
    //     showComplete = true;
    //   }
    //   let filterTodos = {},
    //       filterSubTodos = {};
    //   for (let key in this.todos) {
    //     let todo = this.todos[key];
    //     filterTodos[key] = todo;
    //     for (let subkey in todo.subTasks) {
    //       let subtodo = todo.subTasks[subkey];
    //       // allの場合は全て表示
    //       if (this.showTodoType == 'all') {
    //         subtodo.judge = true;
    //         filterSubTodos[subkey] = subtodo;
    //       }
    //       // completeの場合はチェックがついているもの、activeの時はチェックがついていないものを表示
    //       else if(subtodo.isComplete == showComplete){
    //         subtodo.judge = true;
    //         filterSubTodos[subkey] = subtodo;
    //       } else{
    //         subtodo.judge = false;
    //       }
    //     }
    //   }
    //   return filterTodos;
    // },
    filteredTodos: function () {
      var showComplete = false;
      if (this.showTodoType == 'complete') {
        showComplete = true;
      }
      let filterTodos = {};
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
                filterTodos[subkey] = subtodo;
              }else {
                subtodo.judge = false;
              }
          }
        }
        // for (let subkey in taskCategory) {
        //   let todo = taskCategory[subkey];
        //   // console.log(todo);
        //   // allの場合は全て表示
        //
        //   // completeの場合はチェックがついているもの、activeの時はチェックがついていないものを表示
        //
        // }
      }
      return this.todos;
    },
    taskNumber: function () {
      let count = 0;
      for (var key in this.todos) {
        var todo = this.todos[key];
        console.log(todo);
        // console.log(todo.id);
        if (this.showTodoType == 'all'){
          console.log(todo);
          console.log(todo.subTasks);
          count += 1;
          for (var subkey in todo.subTasks) {
            console.log(subkey);
            var subtodo = todo.subTasks[subkey];
            console.log(subtodo);
            console.log(subtodo.subName);
            count += 1;
          }
        } else if (this.showTodoType == 'active'){
          if (todo.isComplete == false){
            count += 1;
          }
        } else {
          if (todo.isComplete == true){
            count += 1;
          }
        }
      }
      return count;
    }
  },
  methods: {
    createTodo: function() {
      if (this.newTodoName == "") { return; }
      if (this.selected == ""){return; }
      else if (this.selected == "private") {
        this.todosRef.child(this.selected).push({
          name: this.newTodoName,
          date: this.deadline,
          category: this.selected,
        })
      } else {
        this.todosRef.child(this.selected).push({
          name: this.newTodoName,
          date: this.deadline,
          category: this.selected,
        })
      }
      this.newTodoName = "";
    },
    createSubTodo: function(list, subkey) {
      console.log(list.category);
      if (this.newSubTodoName == "") { return; }
      if (list.category == 'private') {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newSubTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          judge: false,
        })
      } else if (list.category == 'recruit') {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newSubTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          judge: false,
        })
      } else {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newSubTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          judge: false,
        })
      }
      this.newSubTodoName = "";
    },
    updateIsCompleteTodo: function(subkey, subtodo, list, subsubkey) {
      subtodo.isComplete = !subtodo.isComplete;
      var updates = {};
      updates[subsubkey] = subtodo;
      console.log(list);
      this.todosRef.child(list.category).child(subkey).child("/subTasks").update(updates)
    },
    // todoの削除
    deleteTodo: function(key) {
      this.todosRef.child(key).remove();
    }
  }
};
</script>

<style>
.card {
  background-color: #c8d2e3;
}

.subcard {
  background-color: #a6b6d5;
}

</style>
