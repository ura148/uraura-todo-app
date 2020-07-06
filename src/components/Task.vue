<template>
  <div class="task">
     <h2>タスク</h2>
    <div>
      <!-- 初期はVーmodelで"newTodoName"を入れているが空白、故にタスク作った後に空白にしないとミスが起こる -->
      <input type="text" v-model="newTodoName">
      <input type="date" v-model="deadline">
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
    <!-- <p>{{ judgeFalseAndTrue }}</p> -->

    <ul v-for="(todo, key) in filteredTodos" :key="todo.id">
      <li class="card">
        <!-- <input type="checkbox" v-model="todo.isComplete" v-on:click="updateIsCompleteTodo(todo, key)"> -->
        <p>{{ todo.name }}</p>
        <p>{{ todo.date }}</p>

        <!-- subTodoを表示 -->
        <div class="subcard" v-for="(subtodo, subkey) in todo.subTasks" :key="subtodo.id">
          <div v-if="subtodo.judge == true">
            <input type="checkbox" v-model="subtodo.isComplete" v-on:click="updateIsCompleteTodo(key, subtodo, subkey)">
            <p>{{ subtodo.subName }}</p>
            <!-- <p>{{ subtodo.subName }}</p> -->
          </div>
        </div>

        <div>
          <input type="text" v-model="newSubTodoName">
          <input type="date" v-model="subDeadline">
          <button type="submit" v-on:click="createSubTodo(key)">サブタスク作成</button>
        </div>
      </li>
      <button type="submit" v-on:click="deleteTodo(key)">削除</button>
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
    filteredTodos: function () {
      var showComplete = false;
      if (this.showTodoType == 'complete') {
        showComplete = true;
      }
      let filterTodos = {},
          filterSubTodos = {};
      for (let key in this.todos) {
        let todo = this.todos[key];
        filterTodos[key] = todo;
        for (let subkey in todo.subTasks) {
          let subtodo = todo.subTasks[subkey];
          // allの場合は全て表示
          if (this.showTodoType == 'all') {
            subtodo.judge = true;
            filterSubTodos[subkey] = subtodo;
          }
          // completeの場合はチェックがついているもの、activeの時はチェックがついていないものを表示
          else if(subtodo.isComplete == showComplete){
            subtodo.judge = true;
            filterSubTodos[subkey] = subtodo;
          } else{
            subtodo.judge = false;
          }
        }
      }
      return filterTodos;
    },
    taskNumber: function () {
      let count = 0;
      for (var key in this.todos) {
        var todo = this.todos[key];
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
    // DBのtodos/[uid]/以下にデータを格納していく。
    createTodo: function() {
      if (this.newTodoName == "") { return; }
      this.todosRef.push({
        name: this.newTodoName,
        date: this.deadline,
      })
      this.newTodoName = "";
    },
    createSubTodo: function(key) {
      if (this.newSubTodoName == "") { return; }
      this.todosRef.child(key).child("/subTasks").push({
        subName: this.newSubTodoName,
        isComplete: false,
        subDate: this.subDeadline,
        pairingId: key,
        judge: false,
      })
      this.newSubTodoName = "";
    },
    updateIsCompleteTodo: function(key, subtodo, subkey) {
      subtodo.isComplete = !subtodo.isComplete;
      // DB内のデータを更新する
      var updates = {};
      // todo.idで変更するtodoタスクを指定し、dataが更新されたtodoを挿入する
      updates[subkey] = subtodo;
      this.todosRef.child(key).child("/subTasks").update(updates)
    },
    // updateIsCompleteSubTodo: function(todo, key) {
    //   todo.subTasks.isComplete = !todo.subTasks.isComplete;
    //   // DB内のデータを更新する
    //   var updates = {};
    //   // todo.idで変更するtodoタスクを指定し、dataが更新されたtodoを挿入する
    //   updates[key] = todo.subTasks;
    //   this.todosRef.update(updates)
    // },
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
