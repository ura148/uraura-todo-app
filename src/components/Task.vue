<template>
  <div class="task">
    <Header/>

    <!-- Category filter button -->
    <main class="main">
      <ul class="tab">
        <li><button v-on:click="activetab=0" v-bind:class="[ activetab === 0 ? 'tab-box__active' : '' ]" class="tab-box">All</button></li>
        <li><button v-on:click="activetab=3" v-bind:class="[ activetab === 3 ? 'tab-box__active' : '' ]" class="tab-box">Bucket List</button></li>
        <li><button v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'tab-box__active' : '' ]" class="tab-box">Private</button></li>
        <li><button v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'tab-box__active' : '' ]" class="tab-box">Recruit</button></li>
      </ul>

      <div class="container">
        <div v-show="activetab === 0" class="tabcontent">
          <ul class="filter">
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">Active&Complete</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
          </ul>
          <!-- listの一覧表示 -->

          <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id">
            <div class="card">
              <p class="card-category-name">{{ key }}</p>
              <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list">

                <!-- list名＋編集btn -->
                <div class="card-namebox">
                  <p class="card-name">{{list.name}}</p>
                  <button type="button" @click="list.fixListShow=!list.fixListShow" class="fa fa-pencil btn-fix"></button>
                  <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn-delete"><span class="fa fa-trash"></span></button>
                </div>

                <!-- list再編集 -->
                <div v-show="list.fixListShow" class="popup">
                  <div  class="popup-fix__todo">
                    <p class="popup-fix-item">List name</p>
                    <input type="text" v-model="list.name" class=" card-todo-input">

                    <p class="popup-fix-item">Category</p>
                    <select v-model="selected" class="card-todo-input card-todo-input__choose">
                      <option v-for="option in options" v-bind:value="option.value" :key="option.id">
                        {{ option.text }}
                      </option>
                    </select>

                    <div class="popup-btn-box">
                      <button type="button" @click="list.fixListShow=!list.fixListShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                      <button type="submit" v-on:click="fixList(list, subkey)" class="popup-btn popup-btn__positive">Done</button>
                    </div>
                  </div>
                </div>

                <!-- todoを表示 -->
                <ul>
                  <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                    <div v-if="subtodo.todoStatus == true" class="card-item">
                      <input type="checkbox" v-model="subtodo.isComplete">
                      <label v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)" class="card-item-name">
                        <span>{{subtodo.subName}}</span>
                        <span>{{changeShowDate(subtodo)}}</span>
                      </label>

                      <!-- Todo編集btnと削除btn -->
                      <div>
                        <!-- todo編集btn -->
                        <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="fa fa-pencil btn-fix"></button>

                        <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn-delete"><span class="fa fa-trash"></span></button>
                      </div>
                    </div>

                    <!-- todo再編集 -->
                    <div v-show="subtodo.fixTodoShow" class="popup">
                      <div class="popup-fix__todo">
                        <p class="popup-fix-item">Todo name</p>
                        <input type="text" v-model="subtodo.subName" v-bind:text="subtodo.subName" class="card-todo-input">

                        <p class="popup-fix-item">Dead line</p>
                        <input type="date" v-model="subDeadline" placeholder="2020-01-01" class="card-todo-input card-todo-input__choose">

                        <div class="popup-btn-box">
                          <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                          <button type="submit" v-on:click="addDeadlineFixName(list, subtodo, subkey, subsubkey); subtodo.fixTodoShow=!subtodo.fixTodoShow" class="popup-btn popup-btn__positive">Done</button>
                        </div>
                      </div>
                    </div>

                  </li>
                </ul>

                <div>
                  <input type="text" v-model="newTodoName" placeholder="Make Todo's name" class="card-todo-input">
                  <button type="button" v-on:click="createTodo(list, subkey)"><span class="fa fa-check"></span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activetab === 3" class="tabcontent">
          <ul class="filter">
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">Active&Complete</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
          </ul>
          <!-- listの一覧表示 -->

          <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id" >
            <div v-if="key == 'bucket list'" class="card">
              <p class="card-category-name">{{ key }}</p>

              <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list">
                <!-- list名＋編集btn -->
                <div class="card-namebox">
                  <p class="card-name">{{list.name}}</p>
                  <button type="button" @click="list.fixListShow=!list.fixListShow" class="fa fa-pencil btn-fix"></button>
                  <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn-delete"><span class="fa fa-trash"></span></button>
                </div>

                <!-- list再編集 -->
                <div v-show="list.fixListShow" class="popup">
                  <div  class="popup-fix__todo">
                    <p class="popup-fix-item">List name</p>
                    <input type="text" v-model="list.name" class=" card-todo-input">

                    <p class="popup-fix-item">Category</p>
                    <select v-model="selected" class="card-todo-input card-todo-input__choose">
                      <option v-for="option in options" v-bind:value="option.value" :key="option.id">
                        {{ option.text }}
                      </option>
                    </select>

                    <div class="popup-btn-box">
                      <button type="button" @click="list.fixListShow=!list.fixListShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                      <button type="submit" v-on:click="fixList(list, subkey)" class="popup-btn popup-btn__positive">Done</button>
                    </div>
                  </div>
                </div>

                <!-- todoを表示 -->
                <ul>
                  <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                    <div v-if="subtodo.todoStatus == true" class="card-item">
                      <input type="checkbox" v-model="subtodo.isComplete">
                      <label v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)" class="card-item-name">
                        <span>{{subtodo.subName}}</span>
                        <span>{{changeShowDate(subtodo)}}</span>
                      </label>

                      <!-- Todo編集btnと削除btn -->
                      <div>
                        <!-- todo編集btn -->
                        <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="fa fa-pencil btn-fix"></button>

                        <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn-delete"><span class="fa fa-trash"></span></button>
                      </div>
                    </div>

                    <!-- todo再編集 -->
                    <div v-show="subtodo.fixTodoShow" class="popup">
                      <div class="popup-fix__todo">
                        <p class="popup-fix-item">Todo name</p>
                        <input type="text" v-model="subtodo.subName" v-bind:text="subtodo.subName" class="card-todo-input">

                        <p class="popup-fix-item">Dead line</p>
                        <input type="date" v-model="subDeadline" placeholder="2020-01-01" class="card-todo-input card-todo-input__choose">

                        <div class="popup-btn-box">
                          <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                          <button type="submit" v-on:click="addDeadlineFixName(list, subtodo, subkey, subsubkey); subtodo.fixTodoShow=!subtodo.fixTodoShow" class="popup-btn popup-btn__positive">Done</button>
                        </div>
                      </div>
                    </div>

                  </li>
                </ul>

                <div>
                  <input type="text" v-model="newTodoName" placeholder="Make Todo's name" class="card-todo-input">
                  <button type="button" v-on:click="createTodo(list, subkey)"><span class="fa fa-check"></span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activetab === 2" class="tabcontent">
          <ul class="filter">
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">Active&Complete</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
          </ul>
          <!-- listの一覧表示 -->

          <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id" >
            <div v-if="key == 'private'" class="card">
              <p class="card-category-name">{{ key }}</p>

              <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list">
                <!-- list名＋編集btn -->
                <div class="card-namebox">
                  <p class="card-name">{{list.name}}</p>
                  <button type="button" @click="list.fixListShow=!list.fixListShow" class="fa fa-pencil btn-fix"></button>
                  <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn-delete"><span class="fa fa-trash"></span></button>
                </div>

                <!-- list再編集 -->
                <div v-show="list.fixListShow" class="popup">
                  <div  class="popup-fix__todo">
                    <p class="popup-fix-item">List name</p>
                    <input type="text" v-model="list.name" class=" card-todo-input">

                    <p class="popup-fix-item">Category</p>
                    <select v-model="selected" class="card-todo-input card-todo-input__choose">
                      <option v-for="option in options" v-bind:value="option.value" :key="option.id">
                        {{ option.text }}
                      </option>
                    </select>

                    <div class="popup-btn-box">
                      <button type="button" @click="list.fixListShow=!list.fixListShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                      <button type="submit" v-on:click="fixList(list, subkey)" class="popup-btn popup-btn__positive">Done</button>
                    </div>
                  </div>
                </div>

                <!-- todoを表示 -->
                <ul>
                  <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                    <div v-if="subtodo.todoStatus == true" class="card-item">
                      <input type="checkbox" v-model="subtodo.isComplete">
                      <label v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)" class="card-item-name">
                        <span>{{subtodo.subName}}</span>
                        <span>{{changeShowDate(subtodo)}}</span>
                      </label>

                      <!-- Todo編集btnと削除btn -->
                      <div>
                        <!-- todo編集btn -->
                        <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="fa fa-pencil btn-fix"></button>

                        <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn-delete"><span class="fa fa-trash"></span></button>
                      </div>
                    </div>

                    <!-- todo再編集 -->
                    <div v-show="subtodo.fixTodoShow" class="popup">
                      <div class="popup-fix__todo">
                        <p class="popup-fix-item">Todo name</p>
                        <input type="text" v-model="subtodo.subName" v-bind:text="subtodo.subName" class="card-todo-input">

                        <p class="popup-fix-item">Dead line</p>
                        <input type="date" v-model="subDeadline" placeholder="2020-01-01" class="card-todo-input card-todo-input__choose">

                        <div class="popup-btn-box">
                          <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                          <button type="submit" v-on:click="addDeadlineFixName(list, subtodo, subkey, subsubkey); subtodo.fixTodoShow=!subtodo.fixTodoShow" class="popup-btn popup-btn__positive">Done</button>
                        </div>
                      </div>
                    </div>

                  </li>
                </ul>

                <div>
                  <input type="text" v-model="newTodoName" placeholder="Make Todo's name" class="card-todo-input">
                  <button type="button" v-on:click="createTodo(list, subkey)"><span class="fa fa-check"></span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activetab === 1" class="tabcontent">
          <ul class="filter">
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">Active&Complete</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
          </ul>
          <!-- listの一覧表示 -->

          <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id" >
            <div v-if="key == 'recruit'" class="card">
              <p class="card-category-name">{{ key }}</p>

              <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list">
                <!-- list名＋編集btn -->
                <div class="card-namebox">
                  <p class="card-name">{{list.name}}</p>
                  <button type="button" @click="list.fixListShow=!list.fixListShow" class="fa fa-pencil btn-fix"></button>
                  <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn-delete"><span class="fa fa-trash"></span></button>
                </div>

                <!-- list再編集 -->
                <div v-show="list.fixListShow" class="popup">
                  <div  class="popup-fix__todo">
                    <p class="popup-fix-item">List name</p>
                    <input type="text" v-model="list.name" class=" card-todo-input">

                    <p class="popup-fix-item">Category</p>
                    <select v-model="selected" class="card-todo-input card-todo-input__choose">
                      <option v-for="option in options" v-bind:value="option.value" :key="option.id">
                        {{ option.text }}
                      </option>
                    </select>

                    <div class="popup-btn-box">
                      <button type="button" @click="list.fixListShow=!list.fixListShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                      <button type="submit" v-on:click="fixList(list, subkey)" class="popup-btn popup-btn__positive">Done</button>
                    </div>
                  </div>
                </div>

                <!-- todoを表示 -->
                <ul>
                  <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                    <div v-if="subtodo.todoStatus == true" class="card-item">
                      <input type="checkbox" v-model="subtodo.isComplete">
                      <label v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)" class="card-item-name">
                        <span>{{subtodo.subName}}</span>
                        <span>{{changeShowDate(subtodo)}}</span>
                      </label>

                      <!-- Todo編集btnと削除btn -->
                      <div>
                        <!-- todo編集btn -->
                        <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="fa fa-pencil btn-fix"></button>

                        <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn-delete"><span class="fa fa-trash"></span></button>
                      </div>
                    </div>

                    <!-- todo再編集 -->
                    <div v-show="subtodo.fixTodoShow" class="popup">
                      <div class="popup-fix__todo">
                        <p class="popup-fix-item">Todo name</p>
                        <input type="text" v-model="subtodo.subName" v-bind:text="subtodo.subName" class="card-todo-input">

                        <p class="popup-fix-item">Dead line</p>
                        <input type="date" v-model="subDeadline" placeholder="2020-01-01" class="card-todo-input card-todo-input__choose">

                        <div class="popup-btn-box">
                          <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                          <button type="submit" v-on:click="addDeadlineFixName(list, subtodo, subkey, subsubkey); subtodo.fixTodoShow=!subtodo.fixTodoShow" class="popup-btn popup-btn__positive">Done</button>
                        </div>
                      </div>
                    </div>

                  </li>
                </ul>

                <div>
                  <input type="text" v-model="newTodoName" placeholder="Make Todo's name" class="card-todo-input">
                  <button type="button" v-on:click="createTodo(list, subkey)"><span class="fa fa-check"></span></button>
                </div>
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
        <!-- 初期はVーmodelで"newlistName"を入れているが空白、故にタスク作った後に空白にしないとミスが起こる -->
        <div class="inputtodomake">
          <input type="text" v-model="newlistName">
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
    </main>

  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import firebase from "firebase";

export default {
  name: "Task",
  data() {
    return {
      show: false,
      activetab: 0,
      database: null,
      todosRef: null,
      newlistName: '',
      fixListName: '',
      newTodoName: '',
      fixTodoName: '',
      deadline: '',
      subDeadline: '',
      showTodoType: "all",
      selected: '',
      options: [
        { text: 'bucket list', value: 'bucket list' },
        { text: 'private', value: 'private' },
        { text: 'recruit', value: 'recruit' },
      ],
      todos: []
    };
  },
  components: {
    Header
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
      if (this.newlistName == "") { return; }
      if (this.selected == ""){return; }
      else  {
        this.todosRef.child(this.selected).push({
          fixListShow: false,
          havechildren: 0,
          name: this.newlistName,
          category: this.selected,
          achievementRate: 0,
        })
      }
      this.newlistName = "";
    },
    fixList: function (list, subkey) {
      if (list.name == "") { return; }
      if (this.selected == ""){return; }
      else  {
        console.log("修正完了！");
        let fixListName = list.name
        list.name = fixListName;
        list.category = this.selected;
        let fixed = {};
        fixed[subkey] = list;
        list.fixListShow = false
        this.todosRef.child(list.category).update(fixed)
      }
      this.fixListName = "";
      this.selected = "";
    },
    createTodo: function(list, subkey) {
      console.log(list.category);
      if (this.newTodoName == "") { return; }
      else {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          todoStatus: false,
          fixTodoShow: false,
        })
      }
      this.newTodoName = "";
    },
    addDeadlineFixName: function (list, subtodo, subkey, subsubkey) {
      if (subtodo.subName == "") { return; }
      else  {
        let newname = subtodo.subName
        console.log("修正完了！");
        subtodo.subName = newname;
        subtodo.subDate = this.subDeadline;
        subtodo.fixTodoShow = false;

        let addDateFixName = {};
        addDateFixName[subsubkey] = subtodo;

        this.todosRef.child(list.category).child(subkey).child("/subTasks").update(addDateFixName)
      }
      this.fixListName = "";
    },
    updateIsCompleteTodo: function(subkey, subtodo, list, subsubkey) {
      subtodo.isComplete = !subtodo.isComplete;
      var updates = {};
      updates[subsubkey] = subtodo;
      console.log(list);
      this.todosRef.child(list.category).child(subkey).child("/subTasks").update(updates)
    },
    changeShowDate: function(subtodo) {
      let planeDate = subtodo.subDate;
      let changeDate = planeDate.slice(-5);

      return changeDate;
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

  input[type="checkbox"] + label:last-child { margin-bottom: 0; }

  input[type="checkbox"] + label:before {
    content: '';
    display: block;
    width: 20px;
    height: 20px;
    border: 1px solid #050505;
    border-radius: 100px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    opacity: .6;
    -webkit-transition: all .12s, border-color .08s;
    transition: all .12s, border-color .08s;
  }

  input[type="checkbox"]:checked + label:before {
    width: 8px;
    height: 12px;
    top: 30%;
    transform: translateY(-50%);
    left: 6px;
    border-radius: 0;
    opacity: 1;
    border-top-color: transparent;
    border-left-color: transparent;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  .main {
    min-height: calc(100vh - 88px);
    background-color: #d5e1fd;
    margin-top: 88px;
  }

  .container {
    box-sizing: border-box;
    padding: 16px 18px 0px;
    padding-top: 16px;
  }

  .card {
    width: 100%
  }
    .card-category-name {
      margin-bottom: 16px;
    }
    .card-namebox {
      display: flex;
      margin-bottom: 16px;
      align-items: center;
    }
    .card-name {
      font-weight: bold;
    }
    .card-list {
      box-sizing: border-box;
      padding: 16px 8px;
      width: 100%;
      border-radius: 8px;
      background-color: #fafafa;
      margin-bottom: 36px;
      box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
    }
    .card-item {
      padding: 16px 8px;
      width: 100;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
      margin-bottom: 8px;
      align-items: center;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-item-name {
      position: relative;
      padding-left: 35px;
      font: 14px/20px 'Open Sans', Arial, sans-serif;
      color: #000;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      display: flex;
      flex-flow: column;
      margin-bottom: 0;
    }
    .card-todo-input {
      height: 20px;
      border: none;
      border-bottom: 1px solid #707070;
    }
      .card-todo-input__choose{
        background-color: #fff;
      }
  .tab {
    display: flex;
    position: fixed;
    z-index: 3;
    top: 48px;
    background-color: #fff;
    box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
  }
    .tab-box {
      width: 25vw;
      height: 40px;
      font-size: 1.4rem;
      font-weight: bold;
    }
      .tab-box__active {
        color: #f76756;
        background-color: #f4f4f4;
        border-bottom: 2px solid #707070;
      }

  .filter {
    display: flex;
    justify-content: center;
  }
    .filter-item:not(:last-child) {
      margin-right: 20px;
    }
    .filter-btn {
      padding: 4px 16px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
    }

  .btn {
    cursor: pointer;
  }
    .btn-delete {
      width: 24px;
      height: 24px;
      border-radius: 24px;
      background-color: #f4f4f4;
      color: #b4b4b4;
    }

  .popup {
    content: '';
    display: block;
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
  }
    .popup-fix__todo {
      box-sizing: border-box;
      padding: 16px;
      width: calc(100vw - 36px);
      background-color: #fff;
      border-radius: 8px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 15;
    }
    .popup-fix-item {
      margin: 16px 0;
    }
    .popup-fix-item:first-of-type {
      margin-top: 0;
    }
    .popup-btn-box {
      margin-top: 24px;
      text-align: center;
    }

    .popup-btn {
      padding: 8px 0;
      width: 80px;
      border-radius: 8px;
      color: #ffffff;
    }
      .popup-btn__negative {
        background-color: #bcbcbc;
        font-size: 1.2rem;
      }
      .popup-btn__positive {
        background-color: #719cfc;
        font-size: 1.4rem;
        font-weight: bold;
      }
      .popup-btn__left {
        margin-right: 32px;
      }
</style>
