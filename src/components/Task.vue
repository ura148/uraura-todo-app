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
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'; fachievementRate()">すべて</button></li>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'; fachievementRate()">未完タスク一覧</button></li>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'; fachievementRate()">完了タスク一覧</button></li>
    </ul>


    <!-- todoの一覧表示 -->
    <p>{{ taskNumber + "個のタスク" }}</p>
    <!-- <button type="button" v-on:click="getsubtododata()">該当データ数</button> -->

    <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id">
      <div class="card">
        <p>{{ key }}</p>
          <div v-for="(list, subkey) in taskCategory" :key="list.id" class="subcard">
            <p>{{list.name}}</p>
            <p>{{ list.achievementRate + "%完了" }}</p>
            <ul>
              <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id" class="todo">
                  <input v-if="subtodo.judge == true" type="checkbox" v-model="subtodo.isComplete">
                  <label v-if="subtodo.judge == true" v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                  <button v-if="subtodo.judge == true" type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
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

    <!-- <ul>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'private'">private</button></li>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'recruit'">recruit</button></li>
      <li><button class="btn" type="submit" v-on:click="showTodoType = 'beforeIDie'">bucket list</button></li>
    </ul> -->
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
    },
    taskNumber: function () {
      let showComplete = false,
          allCount = 0,
          count = 0;
      if (this.showTodoType == 'complete') {
        showComplete = true;
      }
      for (let key in this.todos) {
        let taskCategory = this.todos[key];
        for (let subkey in taskCategory) {
          let list = taskCategory[subkey];
          for (let subsubkey in list.subTasks) {
            let subtodo = list.subTasks[subsubkey];
            console.log(subtodo);
            allCount += 1;
            if (this.showTodoType == 'all'){
              console.log("");
            } else if (subtodo.isComplete == showComplete) {
              count += 1;
            }
          }
        }
      }
      if (this.showTodoType == 'all') {
        return allCount;
      } else {
        return count;
      }
    }
  },
  methods: {
    createTodo: function() {
      if (this.newTodoName == "") { return; }
      if (this.selected == ""){return; }
      else  {
        this.todosRef.child(this.selected).push({
          name: this.newTodoName,
          date: this.deadline,
          category: this.selected,
          achievementRate: 0,
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
    deleteLists: function(key) {
      this.todosRef.child(key).remove();
    },
    // todoの削除
    deleteTodos: function(subkey, list, subsubkey) {
      this.todosRef.child(list.category).child(subkey).child("/subTasks").child(subsubkey).remove();
    },
    fachievementRate: function () {
      for (let key in this.todos) {
        let taskCategory = this.todos[key];
        for (let subkey in taskCategory) {
          let list = taskCategory[subkey],
              numerator = 0,
              denominator = 0;
         for (let subsubkey in list.subTasks) {
           let subtodo = list.subTasks[subsubkey];
           console.log(subtodo);
           denominator += 1;
             if (subtodo.isComplete == true){
               numerator += 1;
             }
           list.achievementRate = numerator / denominator * 100;
         }
        }
      }
    }
  }
};
</script>

<style>
  .card {
    padding: 16px;
    margin: 16px;
    background-color: #c8d2e3;
    text-align: left;
  }

  .subcard {
    padding: 12px;
    margin: 16px;
    background-color: #a6b6d5;
  }

  .todo {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  input[type="checkbox"] { display: none; }

  input[type="checkbox"] + label {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 20px;
    font: 14px/20px 'Open Sans', Arial, sans-serif;
    color: #000;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  input[type="checkbox"] + label:last-child { margin-bottom: 0; }

  input[type="checkbox"] + label:before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border: 1px solid #050505;
    border-radius: 100px;
    position: absolute;
    left: 0;
    top: 0;
    opacity: .6;
    -webkit-transition: all .12s, border-color .08s;
    transition: all .12s, border-color .08s;
  }

  input[type="checkbox"]:checked + label:before {
    width: 10px;
    top: -5px;
    left: 5px;
    border-radius: 0;
    opacity: 1;
    border-top-color: transparent;
    border-left-color: transparent;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>
