<template>
  <div class="task">
    <header>
      <h1>CategoList</h1>
    </header>

    <!-- Category filter radio button -->
    <div class="tabs">
      <button v-on:click="activetab=0" v-bind:class="[ activetab === 0 ? 'active' : '' ]" class="button-category">All</button>
      <button v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'active' : '' ]" class="button-category">Recruit</button>
      <button v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'active' : '' ]" class="button-category">Private</button>
      <button v-on:click="activetab=3" v-bind:class="[ activetab === 3 ? 'active' : '' ]" class="button-category">Bucket List</button>
    </div>

    <div class="content">
      <div v-show="activetab === 0" class="tabcontent">
        <ul>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'; achievementRate()">すべて</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'; achievementRate()">未完タスク一覧</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'; achievementRate()">完了タスク一覧</button></li>
        </ul>
        <!-- listの一覧表示 -->

        <router-link to="/calendar">Calendar</router-link>

        <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id">
          <div class="card">
            <p>{{ key }}</p>
            <div v-for="(list, subkey) in taskCategory" :key="list.id" class="subcard">
              <p>{{list.name}}</p>
              <button type="button" @click="list.fixListShow=!list.fixListShow" class="fa fa-pencil"></button>
              <!-- リスト再編集 -->
              <div v-show="list.fixListShow">
                <input type="text" v-model="fixListName">
                <select v-model="selected">
                  <option v-for="option in options" v-bind:value="option.value" :key="option.id">
                    {{ option.text }}
                  </option>
                </select>
                <button type="submit" v-on:click="fixList(list, subkey)">修正完了</button>
              </div>

              <ul>
                <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                  <div v-if="subtodo.todoStatus == true" class="todo">
                    <input type="checkbox" v-model="subtodo.isComplete">
                    <label v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                    <p>{{subtodo.subDate}}</p>
                    <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
                  </div>
                </li>
              </ul>

              <div>
                <input type="text" v-model="newSubTodoName">
                <input type="date" v-model="subDeadline">
                <button type="button" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
              </div>
              <button type="submit" v-on:click="deleteLists(list, subkey)">削除</button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="activetab === 1" class="tabcontent">
        <ul>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'; achievementRate()">すべて</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'; achievementRate()">未完タスク一覧</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'; achievementRate()">完了タスク一覧</button></li>
        </ul>
        <!-- listの一覧表示 -->

        <router-link to="/calendar">Calendar</router-link>

        <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id">
          <div v-if="key == 'recruit'" class="card">
            <p>{{ key }}</p>
            <div v-for="(list, subkey) in taskCategory" :key="list.id" class="subcard">
              <p>{{list.name}}</p>
              <p>{{ list.achievementRate + "%完了" }}</p>
              <ul>
                <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id" class="todo">
                  <input v-if="subtodo.todoStatus == true" type="checkbox" v-model="subtodo.isComplete">
                  <label v-if="subtodo.todoStatus == true" v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                  {{subtodo.subDate}}
                  <button type="button" name="button">タスク再編集</button>
                  <button v-if="subtodo.todoStatus == true" type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
                </li>
              </ul>

              <div>
                <input type="text" v-model="newSubTodoName">
                <input type="date" v-model="subDeadline">
                <button type="button" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
              </div>
              <button type="submit" v-on:click="deleteLists(list, subkey)">削除</button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="activetab === 2" class="tabcontent">
        <ul>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'; achievementRate()">すべて</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'; achievementRate()">未完タスク一覧</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'; achievementRate()">完了タスク一覧</button></li>
        </ul>
        <!-- listの一覧表示 -->

        <router-link to="/calendar">Calendar</router-link>

        <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id">
          <div v-if="key == 'private'" class="card">
            <p>{{ key }}</p>
            <div v-for="(list, subkey) in taskCategory" :key="list.id" class="subcard">
              <p>{{list.name}}</p>
              <p>{{ list.achievementRate + "%完了" }}</p>
              <ul>
                <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                    <input v-if="subtodo.todoStatus == true" type="checkbox" v-model="subtodo.isComplete">
                    <label v-if="subtodo.todoStatus == true" v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                    p{{subtodo.subDate}}
                    <button v-if="subtodo.todoStatus == true" type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
                </li>
              </ul>

              <div>
                <input type="text" v-model="newSubTodoName">
                <input type="date" v-model="subDeadline">
                <button type="button" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
              </div>
              <button type="submit" v-on:click="deleteLists(list, subkey)">削除</button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="activetab === 3" class="tabcontent">
        <ul>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'; achievementRate()">すべて</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'; achievementRate()">未完タスク一覧</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'; achievementRate()">完了タスク一覧</button></li>
        </ul>
        <!-- listの一覧表示 -->

        <router-link to="/calendar">Calendar</router-link>

        <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id">
          <div v-if="key == 'bucket list'" class="card">
            <p>{{ key }}</p>
              <div v-for="(list, subkey) in taskCategory" :key="list.id" class="subcard">
                <p>{{list.name}}</p>
                <p>{{ list.achievementRate + "%完了" }}</p>
                <ul>
                  <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id" class="todo">
                      <input v-if="subtodo.todoStatus == true" type="checkbox" v-model="subtodo.isComplete">
                      <label v-if="subtodo.todoStatus == true" v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                      <p v-if="subtodo.todoStatus == true">{{subtodo.subDate}}</p>
                      <button v-if="subtodo.todoStatus == true" type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
                  </li>
                </ul>

                <div>
                  <input type="text" v-model="newSubTodoName">
                  <input type="date" v-model="subDeadline">
                  <button type="button" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
                </div>
                <button type="submit" v-on:click="deleteLists(list, subkey)">削除</button>
              </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Make list button -->
    <button type="button" name="makelist" @click="show=!show" class="button-round button-round__left" v-bind:class="{actives: show}">
      <span v-if="show == false" class="fa fa-list"></span>
      <span v-else class="fa fa-times"></span>
    </button>

    <!-- Make list contents -->
    <div v-show="show" class="todomake">
      <!-- 初期はVーmodelで"newTodoName"を入れているが空白、故にタスク作った後に空白にしないとミスが起こる -->
      <div class="inputtodomake">
        <input type="text" v-model="fixListName">
        <select v-model="selected">
          <option v-for="option in options" v-bind:value="option.value" :key="option.id">
            {{ option.text }}
          </option>
        </select>
        <!-- <button type="submit" v-on:click="createList()">タスク作成</button> -->
        <button type="submit" v-on:click="createList()">リスト作成</button>
      </div>
    </div>

    <router-link to="/calendar">
      <button type="button" name="makelist" class="button-round button-round__right">
        <span class="fa fa-calendar-check-o"></span>
      </button>
    </router-link>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Task",
  data() {
    return {
      show: false,
      activetab: 0,
      database: null,
      todosRef: null,
      newTodoName: "",
      fixListName:'',
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
    filteredTodos: function () {
      var showComplete = false;
      if (this.showTodoType == 'complete') {
        showComplete = true;
      }
      for (let key in this.todos) {
        let taskCategory = this.todos[key];
        // console.log(taskCategory);
        for (let subkey in taskCategory) {
          let list = taskCategory[subkey];
          // console.log(list);
          for (let subsubkey in list.subTasks) {
            let subtodo = list.subTasks[subsubkey];
             if (this.showTodoType == 'all') {
               subtodo.todoStatus = true;
             }
              else if(subtodo.isComplete == showComplete) {
                subtodo.todoStatus = true;
              }else {
                subtodo.todoStatus = false;
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
            if (this.showTodoType == 'all');
            else if (subtodo.isComplete == showComplete) {
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
    createList: function() {
      if (this.newTodoName == "") { return; }
      if (this.selected == ""){return; }
      else  {
        this.todosRef.child(this.selected).push({
          fixListShow: false,
          havechildren: 0,
          name: this.newTodoName,
          category: this.selected,
          achievementRate: 0,
        })
      }
      this.newTodoName = "";
    },
    fixList: function (list, subkey) {
      if (this.fixListName == "") { return; }
      if (this.selected == ""){return; }
      else  {
        console.log("修正完了！");
        list.name = this.fixListName;
        list.category = this.selected;
        let fixed = {};
        fixed[subkey] = list;
        list.fixListShow = false
        this.todosRef.child(list.category).update(fixed)
      }
      this.fixListName = "";
      this.selected = "";

    },
    createSubTodo: function(list, subkey) {
      console.log(list.category);
      if (this.newSubTodoName == "") { return; }
      if (list.category == 'private') {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newSubTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          todoStatus: false,
        })
      } else if (list.category == 'recruit') {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newSubTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          todoStatus: false,
        })
      } else {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newSubTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          todoStatus: false,
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
    deleteLists: function(list, subkey) {
      this.todosRef.child(list.category).child(subkey).remove();
    },
    // todoの削除
    deleteTodos: function(subkey, list, subsubkey) {
      this.todosRef.child(list.category).child(subkey).child("/subTasks").child(subsubkey).remove();
    },
    achievementRate: function () {
      for (let key in this.todos) {
        let taskCategory = this.todos[key];
        for (let subkey in taskCategory) {
          let list = taskCategory[subkey],
              numerator = 0,
              denominator = 0;
         for (let subsubkey in list.subTasks) {
           let subtodo = list.subTasks[subsubkey];
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

  .todomake {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .active {
    color: red;
  }

  .inputtodomake{
    position: absolute;
    z-index: 5;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

  .button-category {
    padding: 16px 0;
    width: 25vw;
    border: 1px solid #cccccc;
  }
</style>
