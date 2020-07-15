<template>
  <div class="task">
    <Header/>
    <!-- Category filter button -->
    <main class="main">
      <div class="showchange">
        <ul class="tab">
          <li><button v-on:click="activetab=0" v-bind:class="[ activetab === 0 ? 'tab-box__active' : '' ]" class="tab-box">All</button></li>
          <li><button v-on:click="activetab=3" v-bind:class="[ activetab === 3 ? 'tab-box__active' : '' ]" class="tab-box">Bucket List</button></li>
          <li><button v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'tab-box__active' : '' ]" class="tab-box">Private</button></li>
          <li><button v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'tab-box__active' : '' ]" class="tab-box">Recruit</button></li>
        </ul>

        <ul class="filter">
          <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">All</button></li>
          <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
          <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
        </ul>
      </div>

      <div class="container">
        <div v-show="activetab === 0" class="category">
          <!-- listの一覧表示 -->
          <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id" class="category-box">
            <div class="card">
              <p class="card-category-name">{{ key }}</p>
              <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list">

                <!-- list名＋編集btn -->
                <div class="card-namebox">
                  <p class="card-name">{{list.name}}</p>
                  <button type="button" @click="list.fixListShow=!list.fixListShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                  <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                </div>

                <!-- list再編集 -->
                <div v-show="list.fixListShow" class="popup">
                  <div  class="popup-fix__todo">
                    <p class="popup-item">List name</p>
                    <input type="text" v-model="list.name" class=" card-todo-input">

                    <p class="popup-item">Category</p>
                    <select v-model="selectCategory" class="card-todo-input">
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
                        <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                        <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                      </div>
                    </div>

                    <!-- todo再編集 -->
                    <div v-show="subtodo.fixTodoShow" class="popup">
                      <div class="popup-fix__todo">
                        <p class="popup-item">Todo name</p>
                        <input type="text" v-model="subtodo.subName" v-bind:text="subtodo.subName" class="card-todo-input">

                        <p class="popup-item">Dead line</p>
                        <input type="date" v-model="subDeadline" placeholder="2020-01-01" class="card-todo-input">

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
                  <button type="button" v-on:click="createTodo(list, subkey)" class="btn btn-done"><span class="fa fa-check"></span></button>
                </div>
              </div>
              <button  v-if="windowW >= 1024" type="button" name="makelist" @click="show=!show" class="btn-makelist" v-bind:class="{actives: show}">
                <span>リスト追加</span>
              </button>
            </div>
          </div>
        </div>
        <div v-show="activetab === 3" class="tabcontent">
          <!-- listの一覧表示 -->
          <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id" >
            <div v-if="key == 'bucket list'" class="card">
              <p class="card-category-name card-category-name__scrollH">{{ key }}</p>
              <div class="card-scrollH">
                <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list card-list__scrollH">
                  <!-- list名＋編集btn -->
                  <div class="card-namebox">
                    <p class="card-name">{{list.name}}</p>
                    <button type="button" @click="list.fixListShow=!list.fixListShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                    <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                  </div>

                  <!-- list再編集 -->
                  <div v-show="list.fixListShow" class="popup">
                    <div  class="popup-fix__todo">
                      <p class="popup-item">List name</p>
                      <input type="text" v-model="list.name" class=" card-todo-input">

                      <p class="popup-item">Category</p>
                      <select v-model="selectCategory" class="card-todo-input">
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
                          <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                          <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                        </div>
                      </div>

                      <!-- todo再編集 -->
                      <div v-show="subtodo.fixTodoShow" class="popup">
                        <div class="popup-fix__todo">
                          <p class="popup-item">Todo name</p>
                          <input type="text" v-model="subtodo.subName" v-bind:text="subtodo.subName" class="card-todo-input">

                          <p class="popup-item">Dead line</p>
                          <input type="date" v-model="subDeadline" placeholder="2020-01-01" class="card-todo-input">

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
                <button type="button" name="makelist" @click="show=!show" class="btn-makelist btn-makelist__scrollH" v-bind:class="{actives: show}">
                  <span>リスト追加</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activetab === 2" class="tabcontent">
          <!-- listの一覧表示 -->
          <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id" >
            <div v-if="key == 'private'" class="card">
              <p class="card-category-name card-category-name__scrollH">{{ key }}</p>
              <div class="card-scrollH">
                <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list card-list__scrollH">
                  <!-- list名＋編集btn -->
                  <div class="card-namebox">
                    <p class="card-name">{{list.name}}</p>
                    <button type="button" @click="list.fixListShow=!list.fixListShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                    <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                  </div>

                  <!-- list再編集 -->
                  <div v-show="list.fixListShow" class="popup">
                    <div  class="popup-fix__todo">
                      <p class="popup-item">List name</p>
                      <input type="text" v-model="list.name" class=" card-todo-input">

                      <p class="popup-item">Category</p>
                      <select v-model="selectCategory" class="card-todo-input">
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
                          <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                          <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                        </div>
                      </div>

                      <!-- todo再編集 -->
                      <div v-show="subtodo.fixTodoShow" class="popup">
                        <div class="popup-fix__todo">
                          <p class="popup-item">Todo name</p>
                          <input type="text" v-model="subtodo.subName" v-bind:text="subtodo.subName" class="card-todo-input">

                          <p class="popup-item">Dead line</p>
                          <input type="date" v-model="subDeadline" placeholder="2020-01-01" class="card-todo-input">

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
                <button type="button" name="makelist" @click="show=!show" class="btn-makelist btn-makelist__scrollH" v-bind:class="{actives: show}">
                  <span>リスト追加</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activetab === 1" class="tabcontent">
          <!-- listの一覧表示 -->
          <div v-for="(taskCategory, key) in filteredTodos" :key="taskCategory.id" >
            <div v-if="key == 'recruit'" class="card">
              <p class="card-category-name card-category-name__scrollH">{{ key }}</p>
              <div class="card-scrollH">
                <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list card-list__scrollH">
                  <!-- list名＋編集btn -->
                  <div class="card-namebox">
                    <p class="card-name">{{list.name}}</p>
                    <button type="button" @click="list.fixListShow=!list.fixListShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                    <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                  </div>

                  <!-- list再編集 -->
                  <div v-show="list.fixListShow" class="popup">
                    <div  class="popup-fix__todo">
                      <p class="popup-item">List name</p>
                      <input type="text" v-model="list.name" class=" card-todo-input">

                      <p class="popup-item">Category</p>
                      <select v-model="selectCategory" class="card-todo-input">
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
                          <button type="button" @click="subtodo.fixTodoShow=!subtodo.fixTodoShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                          <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                        </div>
                      </div>

                      <!-- todo再編集 -->
                      <div v-show="subtodo.fixTodoShow" class="popup">
                        <div class="popup-fix__todo">
                          <p class="popup-item">Todo name</p>
                          <input type="text" v-model="subtodo.subName" v-bind:text="subtodo.subName" class="card-todo-input">

                          <p class="popup-item">Dead line</p>
                          <input type="date" v-model="subDeadline" placeholder="2020-01-01" class="card-todo-input">

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
                    <button type="button" v-on:click="createTodo(list, subkey)" class="btn"><span class="fa fa-check"></span></button>
                  </div>
                </div>
                <button type="button" name="makelist" @click="show=!show" class="btn-makelist btn-makelist__scrollH" v-bind:class="{actives: show}">
                  <span>リスト追加</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Make list button -->
      <button type="button" name="makelist" @click="show=!show" class="btn-round btn-round__left" v-bind:class="{actives: show}" v-if="windowW <= 1024">
        <span v-if="show == false" class="fa fa-list"></span>
        <span v-else class="fa fa-times"></span>
      </button>

      <!-- Make list contents -->
      <div v-show="show" class="popup">
        <div class="popup-fix__todo">
          <p class="popup-item">List name</p>
          <input type="text" v-model="newlistName" class="card-todo-input">

          <p class="popup-item">Category</p>
          <select v-model="selectCategory" class="card-todo-input">
            <option v-for="option in options" v-bind:value="option.value" :key="option.id">
              {{ option.text }}
            </option>
          </select>

          <div class="popup-btn-box">
            <button type="button" @click="show=!show" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
            <button type="submit" @click="createList()" class="popup-btn popup-btn__positive">Done</button>
          </div>
        </div>
      </div>

      <router-link to="/calendar" v-if="windowW <= 1024">
        <button type="button" name="makelist" class="btn-round btn-round__right">
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
      windowW: window.innerWidth,
      windowH: window.innerHeight,
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
      selectCategory: '',
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
    handleResize: function() {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      this.windowW = window.innerWidth;
      this.windowH = window.innerHeight;
    },
    createList: function() {
      if (this.newlistName == "") { return; }
      if (this.selectCategory == ""){return; }
      else  {
        this.todosRef.child(this.selectCategory).push({
          fixListShow: false,
          havechildren: 0,
          name: this.newlistName,
          category: this.selectCategory,
          achievementRate: 0,
        })
      }
      this.show = false;
      this.newlistName = "";
    },
    fixList: function (list, subkey) {
      if (list.name == "") { return; }
      if (this.selectCategory == ""){return; }
      else  {
        console.log("修正完了！");
        let fixListName = list.name
        list.name = fixListName;
        list.category = this.selectCategory;
        let fixed = {};
        fixed[subkey] = list;
        list.fixListShow = false
        this.todosRef.child(list.category).update(fixed)
      }
      this.fixListName = "";
      this.selectCategory = "";
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
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }
};
</script>

<style>
input[type="checkbox"] { display: none; }

label > span {
  font-size: 1.6rem;
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
  padding-top: 88px;
}
.container {
  box-sizing: border-box;
  padding: 48px 18px 32px;
}

/*＝＝＝＝＝＝＝＝
カード
＝＝＝＝＝＝＝＝*/
.card {
  width: 100%;
  padding-top: 8px;
  text-align: left;
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
    width: 50%;
    font-size: 1.8rem;
    height: 20px;
    border: none;
    border-bottom: 1px solid #707070;
  }

/*＝＝＝＝＝＝＝＝
カテゴリーフィルタ＆期限フィルタ
＝＝＝＝＝＝＝＝*/
.tab {
  display: flex;
  position: fixed;
  z-index: 1;
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

/*＝＝＝＝＝＝＝＝
フィルタエリア
＝＝＝＝＝＝＝＝*/
.filter {
  padding: 4px;
  width: 100%;
  height: 40px;
  position: fixed;
  z-index: 1;
  left: 50%;
  transform: translatex(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.24);

}
  .filter-item:not(:last-child) {
    margin-right: 20px;
  }
  .filter-btn {
    padding: 4px 16px;
    background-color: #fff;
    border-radius: 8px;
    font-size: 1.6rem;
    box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
  }

/*＝＝＝＝＝＝＝＝
ボタン
＝＝＝＝＝＝＝＝*/
.btn {
  cursor: pointer;
  margin-left: 8px;
  width: 36px;
  height: 36px;
  font-size: 1.6rem;
  border-radius: 36px;
}
  .btn-done {
    margin-left: 16px;
    width: 48px;
    height: 22px;
    border-radius: 8px;
    background-color: #719CFC;
    color: #fff;
  }
  .btn-delete {
    background-color: #f4f4f4;
    color: #b4b4b4;
  }
  .btn-fix {
    background-color: #f4f4f4;
    color: #b4b4b4;
  }
  .btn-round {
    position: fixed;
    z-index: 10;
    width: 56px;
    height: 56px;
    border-radius: 56px;
    background-color: #719CFC;
    color: #fff;
    box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
  }
  .btn-round > span {
    font-size: 2.4rem;
  }
    .btn-round__left {
      left: 18px;
      bottom: 22px;
    }
    .btn-round__right {
      right: 18px;
      bottom: 22px;
    }

/*＝＝＝＝＝＝＝＝
ポップアップ
＝＝＝＝＝＝＝＝*/
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
  .popup-item {
    margin: 16px 0;
  }
  .popup-item:first-of-type {
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
    .popup-btn__submit {
      width: calc(100% / 1.618);
    }
    .popup-btn__left {
      margin-right: 32px;
    }


@media screen and (min-width:1024px) {
  .container {
    padding: 48px 0px 32px
  }
  .showchange {
    display: flex;
  }
  .main {
    padding-top: 48px;
  }
  .tab-box {
    height: 48px;
    max-width: 96px;
  }
  .category {
    min-height: calc(100vh - 112px);
    display: flex;
    justify-content: space-between;
  }
    .category-box {
      flex: 0 0 30%;
    }
    .category-box:first-of-type {
      margin-left: 16px;
    }
    .category-box:last-of-type {
      margin-right: 16px;
    }

    .card-scrollH {
      min-height: calc(100vh - 152px);
      display: flex;
      overflow-x: scroll;
      align-items: flex-start;
    }
    .card-list {
      /* width: 30%; */
    }
      .card-list__scrollH {
        flex: 0 0 30%;
        max-width: 360px;
        margin-right: 32px;
      }
    .card-list__scrollH:first-of-type{
      margin-left: 16px;
    }
    .btn-makelist{
      width: 100%;
      padding: 12px 0;
      flex: 0 0 30%;
      background-color: #719CFC;
      border-radius: 8px;
    }
    .btn-makelist > span {
      font-size: 1.6rem;
      font-weight: bold;
      color: #fff;
    }
    .btn-makelist__scrollH {
      display: block;
      margin-right: 32px;
      max-width: 360px;
    }
    .popup-fix__todo {
      max-width: 640px;
      box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
    }
    .filter-item:first-of-type {
      margin-left: 40px;
    }
}
</style>

<style scoped>
@media screen and (min-width:1024px) {
  .filter {
    width: calc(100vw - 384px);
    justify-content: flex-start;
    left: 384px;
    transform: none;
  }
  .card {

  }
    .card-category-name__scrollH {
      margin-left: 16px;
    }

}
</style>
