<template>
  <div>
    <Header/>
    <main class="main">
      <div class="showchange">
      <!-- Category filter -->
        <div class="tab">
          <button v-on:click="activetab=0" v-bind:class="[ activetab === 0 ? 'tab-box__active' : '' ]" class="tab-box">All</button>
          <button v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'tab-box__active' : '' ]" class="tab-box">day</button>
          <button v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'tab-box__active' : '' ]" class="tab-box">week</button>
        </div>

        <ul class="filter">
          <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">All</button></li>
          <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
          <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
        </ul>
      </div>

      <div class="container">
        <div v-if="activetab === 0" class="category">
          <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id" class="category-box">
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
                    <input type="text" v-model="list.name" class=" popup-input">

                    <p class="popup-item">Category</p>
                    <select v-model="selectCategory" class="popup-input ">
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
                  <li v-for="(todo, subsubkey) in list.subTasks" :key="todo.id">
                    <div v-if="todo.todoStatus == true" class="card-item">
                      <input type="checkbox" v-model="todo.isComplete">
                      <label v-on:click="updateIsCompleteTodo(subkey, todo, list, subsubkey)" class="card-item-name">
                        <span>{{todo.subName}}</span>
                        <span>{{changeShowDate(todo)}}</span>
                      </label>

                      <!-- Todo編集btnと削除btn -->
                      <div>
                        <!-- todo編集btn -->
                        <button type="button" @click="todo.fixTodoShow=!todo.fixTodoShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                        <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                      </div>
                    </div>

                    <!-- todo再編集 -->
                    <div v-show="todo.fixTodoShow" class="popup">
                      <div class="popup-fix__todo">
                        <p class="popup-item">Todo name</p>
                        <input type="text" v-model="todo.subName" v-bind:text="todo.subName" class="popup-input">

                        <p class="popup-item">Dead line</p>
                        <input type="date" v-model="deadline" placeholder="2020-01-01" class="popup-input ">

                        <div class="popup-btn-box">
                          <button type="button" @click="todo.fixTodoShow=!todo.fixTodoShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                          <button type="submit" v-on:click="addDeadlineFixName(list, todo, subkey, subsubkey); todo.fixTodoShow=!todo.fixTodoShow" class="popup-btn popup-btn__positive">Done</button>
                        </div>
                      </div>
                    </div>

                  </li>
                </ul>

                <div>
                  <input type="text" v-model="newTodoName" placeholder="Make Todo's name" class="popup-input">
                  <button type="button" v-on:click="createTodo(list, subkey)" class="btn btn-done"><span class="fa fa-check"></span></button>
                </div>
              </div>
              <button  v-if="windowW >= 1024" type="button" name="makelist" @click="show=!show" class="btn-makelist" v-bind:class="{actives: show}">
                <span>リスト追加</span>
              </button>

            </div>
          </div>
        </div>
        <div v-if="activetab === 1">
          <div class="daydate">
            <button type="button" v-on:click="dayCount--" class="daydate-arrow">◀︎</button>
            <span class="daydate-txt">{{ getTodayDate() }}</span>
            <button type="button" v-on:click="dayCount++" class="daydate-arrow">▶︎</button>
          </div>
          <!-- listの一覧表示 -->
          <div class="category">
            <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id" class="category-box">
              <div class="card">
                <p class="card-category-name">{{ key }}</p>
                <ul v-for="(list, subkey) in taskCategory" :key="list.id">
                <template v-if="list.havechildren != 0">
                  <li  class="card-list">
                    <!-- list名＋編集btn -->
                    <div class="card-namebox">
                      <p class="card-name">{{list.name}}</p>
                      <button type="button" @click="list.fixListShow=!list.fixListShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                      <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                    </div>

                    <!-- list再編集 -->
                    <div v-show="list.fixListShow" class="popup">
                      <div  class="popup-fix__todo">
                        <p class="popup-fix-item">List name</p>
                        <input type="text" v-model="list.name" class=" popup-input">

                        <p class="popup-fix-item">Category</p>
                        <select v-model="selectCategory" class="popup-input ">
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
                      <li v-for="(todo, subsubkey) in list.subTasks" :key="todo.id">
                        <div v-if="todayDate == todo.subDate && todo.todoStatus == true" class="card-item">
                          <input type="checkbox" v-model="todo.isComplete">
                          <label v-on:click="updateIsCompleteTodo(subkey, todo, list, subsubkey)" class="card-item-name">
                            <span>{{todo.subName}}</span>
                            <span>{{changeShowDate(todo)}}</span>
                          </label>

                          <!-- Todo編集btnと削除btn -->
                          <div>
                            <!-- todo編集btn -->
                            <button type="button" @click="todo.fixTodoShow=!todo.fixTodoShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                            <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                          </div>
                        </div>

                        <!-- todo再編集 -->
                        <div v-show="todo.fixTodoShow" class="popup">
                          <div class="popup-fix__todo">
                            <p class="popup-fix-item">Todo name</p>
                            <input type="text" v-model="todo.subName" v-bind:text="todo.subName" class="popup-input">

                            <p class="popup-fix-item">Dead line</p>
                            <input type="date" v-model="deadline" placeholder="2020-01-01" class="popup-input ">

                            <div class="popup-btn-box">
                              <button type="button" @click="todo.fixTodoShow=!todo.fixTodoShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                              <button type="submit" v-on:click="addDeadlineFixName(list, todo, subkey, subsubkey); todo.fixTodoShow=!todo.fixTodoShow" class="popup-btn popup-btn__positive">Done</button>
                            </div>
                          </div>
                        </div>

                      </li>
                    </ul>

                    <div>
                      <input type="text" v-model="newTodoName" placeholder="Make Todo's name" class="popup-input">
                      <button type="button" v-on:click="createTodo(list, subkey)" class="btn btn-done"><span class="fa fa-check"></span></button>
                    </div>
                  </li>
                  </template>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activetab === 2">
          <div class="daydate">
            <button type="button" v-on:click="weekCount--" class="daydate-arrow">◀︎</button>
            <span class="daydate-txt">{{ getWeekDate() }}</span>
            <button type="button" v-on:click="weekCount++" class="daydate-arrow">▶︎</button>
          </div>
          <!-- listの一覧表示 -->
          <div class="category">
            <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id" class="category-box">
              <div class="card">
                <p class="card-category-name">{{ key }}</p>
                <ul v-for="(list, subkey) in taskCategory" :key="list.id">
                <template v-if="list.havechildren != 0">
                  <li  class="card-list">
                    <!-- list名＋編集btn -->
                    <div class="card-namebox">
                      <p class="card-name">{{list.name}}</p>
                      <button type="button" @click="list.fixListShow=!list.fixListShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                      <button type="submit" v-on:click="deleteLists(list, subkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                    </div>

                    <!-- list再編集 -->
                    <div v-show="list.fixListShow" class="popup">
                      <div  class="popup-fix__todo">
                        <p class="popup-fix-item">List name</p>
                        <input type="text" v-model="list.name" class=" popup-input">

                        <p class="popup-fix-item">Category</p>
                        <select v-model="selectCategory" class="popup-input ">
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
                      <li v-for="(todo, subsubkey) in list.subTasks" :key="todo.id">
                        <div v-if="startDate <= todo.subDate && todo.subDate <= endDate && todo.todoStatus == true" class="card-item">
                          <input type="checkbox" v-model="todo.isComplete">
                          <label v-on:click="updateIsCompleteTodo(subkey, todo, list, subsubkey)" class="card-item-name">
                            <span>{{todo.subName}}</span>
                            <span>{{changeShowDate(todo)}}</span>
                          </label>

                          <!-- Todo編集btnと削除btn -->
                          <div>
                            <!-- todo編集btn -->
                            <button type="button" @click="todo.fixTodoShow=!todo.fixTodoShow" class="btn btn-fix"><span class="fa fa-pencil btn-fix"></span></button>
                            <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)" class="btn btn-delete"><span class="fa fa-trash"></span></button>
                          </div>
                        </div>

                        <!-- todo再編集 -->
                        <div v-show="todo.fixTodoShow" class="popup">
                          <div class="popup-fix__todo">
                            <p class="popup-fix-item">Todo name</p>
                            <input type="text" v-model="todo.subName" v-bind:text="todo.subName" class="popup-input">

                            <p class="popup-fix-item">Dead line</p>
                            <input type="date" v-model="deadline" placeholder="2020-01-01" class="popup-input ">

                            <div class="popup-btn-box">
                              <button type="button" @click="todo.fixTodoShow=!todo.fixTodoShow" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
                              <button type="submit" v-on:click="addDeadlineFixName(list, todo, subkey, subsubkey); todo.fixTodoShow=!todo.fixTodoShow" class="popup-btn popup-btn__positive">Done</button>
                            </div>
                          </div>
                        </div>

                      </li>
                    </ul>

                    <div>
                      <input type="text" v-model="newTodoName" placeholder="Make Todo's name" class="popup-input">
                      <button type="button" v-on:click="createTodo(list, subkey)" class="btn btn-done"><span class="fa fa-check"></span></button>
                    </div>
                  </li>
                </template>
              </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="show" class="popup">
        <!-- 初期はVーmodelで"newlistName"を入れているが空白、故にタスク作った後に空白にしないとミスが起こる -->
        <div class="popup-fix__todo">
          <p class="popup-item">List name</p>
          <input type="text" v-model="newlistName" class="popup-input">

          <p class="popup-item">Category</p>
          <select v-model="selectCategory" class="popup-input ">
            <option v-for="option in options" v-bind:value="option.value" :key="option.id">
              {{ option.text }}
            </option>
          </select>

          <!-- <button type="submit" v-on:click="createList()">タスク作成</button> -->
          <div class="popup-btn-box">
            <button type="button" @click="show=!show" class="popup-btn popup-btn__negative popup-btn__left">Cancel</button>
            <button type="submit" @click="createList()" class="popup-btn popup-btn__positive">Done</button>
          </div>
        </div>
      </div>


      <router-link to="/" v-if="windowW <= 1024">
        <button type="button" class="btn-round btn-round__right">
          <span class="fa fa-check-square"></span>
        </button>
      </router-link>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import firebase from "firebase";

export default {
  name: 'calendar',
  data() {
    return {
      windowW: window.innerWidth,
      windowH: window.innerHeight,
      show: false,
      activetab: 0,
      dayCount: 0,
      weekCount: 0,
      monthCount: 0,
      startDate: '',
      endDate: '',
      todayDate:'',
      database: null,
      todosRef: null,
      newlistName: "",
      newTodoName: "",
      deadline: "",
      showTodoType: "all",
      selectCategory: '',
      options: [
        { text: 'bucket list', value: 'bucket list' },
        { text: 'private', value: 'private' },
        { text: 'recruit', value: 'recruit' },

      ],
      todos: []
    }
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
    filteredList: function () {
      let showComplete = false;
      if (this.showTodoType == 'complete') {
        showComplete = true;
      }
      for (let key in this.todos) {
        let taskCategory = this.todos[key];
        for (let subkey in taskCategory) {
          let list = taskCategory[subkey];
          list.havechildren = 0;
          for (let subsubkey in list.subTasks) {
            let todo = list.subTasks[subsubkey];
            // todoTypeがallの場合
            if (this.showTodoType == 'all') {
              todo.todoStatus = true;
            } else if(todo.isComplete == showComplete) {
              todo.todoStatus = true;
            }else {
              todo.todoStatus = false;
            }
            // 全ての期間のタスク表示
            if (this.activetab === 0){
              list.havechildren++;
            // 1日ごとのタスク表示
            }else if (this.activetab === 1){
              if (this.todayDate == todo.subDate){
                list.havechildren++;
              }else;
            // 週間ごとのタスク表示
            }else {
              if (this.startDate <= todo.subDate && todo.subDate <= this.endDate ) {
                list.havechildren++;
              } else;
            }
          }
        }
      }
      return this.todos;
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
          subDate: this.deadline,
          todoStatus: false,
          fixTodoShow: false,
        })
      }
      this.newTodoName = "";
      this.deadline = "";
    },
    updateIsCompleteTodo: function(subkey, todo, list, subsubkey) {
      todo.isComplete = !todo.isComplete;
      var updates = {};
      updates[subsubkey] = todo;
      console.log(list);
      this.todosRef.child(list.category).child(subkey).child("/subTasks").update(updates)
    },
    changeShowDate: function(todo) {
      let planeDate = todo.subDate;
      let changeDate = planeDate.slice(-5);

      return changeDate;
    },
    // 週に関するデータを設定
    setWeekDate: function () {
      let today = new Date();
      let this_year = today.getFullYear();
      let this_month = today.getMonth();
      let date = today.getDate();

      let day_num = today.getDay();
      let this_monday = date - day_num + this.weekCount * 7;
      let this_sunday = this_monday + 6;
      let day = new String('日月火水木金土');

      //月曜日の年月日
      let start_date = new Date(this_year, this_month, this_monday);
          start_date = (start_date.getMonth() + 1) + "/" + start_date.getDate() + " (" + day.charAt( start_date.getDay() ) + ")"
      //日曜日の年月日
      let end_date = new Date(this_year, this_month, this_sunday);
          end_date = (end_date.getMonth() + 1) + "/" + end_date.getDate() + " (" + day.charAt( end_date.getDay() ) +")"


      //日曜日の年月日(データ照合用)
      let planeStartDate = new Date(this_year, this_month, this_monday);
          planeStartDate = planeStartDate.getFullYear() + "-" + ("0"+(planeStartDate.getMonth()+1)).slice(-2) + "-" + ("0"+planeStartDate.getDate()).slice(-2);

      //月曜日の年月日(データ照合用)
      let planeEndDate = new Date(this_year, this_month, this_sunday);
          planeEndDate = planeEndDate.getFullYear() + "-" + ("0"+(planeEndDate.getMonth()+1)).slice(-2) + "-" + ("0"+planeEndDate.getDate()).slice(-2);


      let target_week = start_date + " ～ " + end_date;
      this.startDate = planeStartDate;
      this.endDate = planeEndDate;
      console.log("hoge");
      return [target_week, planeStartDate, planeEndDate];
    },
    setdayDate: function () {
      let today = new Date();
      let this_year = today.getFullYear();
      let this_month = today.getMonth();
      let datex = today.getDate() + this.dayCount;
      let day = new String('日月火水木金土');

      let today_date = new Date(this_year, this_month, datex);
          today_date = (today_date.getMonth()+1)+ "/" + today_date.getDate() + " (" + day.charAt(today_date.getDay() ) +")"

      let planetodayDate = new Date(this_year, this_month, datex);
          planetodayDate = planetodayDate.getFullYear() + "-" + ("0"+(planetodayDate.getMonth()+1)).slice(-2) + "-" + ("0"+planetodayDate.getDate()).slice(-2)

      this.todayDate = planetodayDate;
      console.log(this.todayDate);
      return [planetodayDate, today_date];
    },
    addDeadlineFixName: function (list, todo, subkey, subsubkey) {
      if (todo.subName == "") { return; }
      else  {
        let newname = todo.subName
        console.log("修正完了！");
        todo.subName = newname;
        todo.subDate = this.deadline;
        todo.fixTodoShow = false;

        let addDateFixName = {};
        addDateFixName[subsubkey] = todo;

        this.todosRef.child(list.category).child(subkey).child("/subTasks").update(addDateFixName)
      }
      this.fixListName = "";
    },
    // Listを削除
    deleteLists: function(list, subkey) {
      this.todosRef.child(list.category).child(subkey).remove();
    },
    // ToDoを削除
    deleteTodos: function(subkey, list, subsubkey) {
      this.todosRef.child(list.category).child(subkey).child("/subTasks").child(subsubkey).remove();
    },
    // 週情報を取得
    getTodayDate: function (){
      let daydate = this.setdayDate();
      return daydate[1];
    },
    getWeekDate: function () {
      let a = this.setWeekDate();
      return a[0];
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
.daydate {
  margin-top: 16px;
  text-align: center;
}
  .daydate-txt {
    font-size: 1.6rem;
  }
  .daydate-arrow {
    font-size: 1.6rem;
  }
.tab-box {
  width: 33.3333vw;
}
@media screen and (min-width:1024px){
  .filter {
    width: calc(100vw - 288px);
    justify-content: flex-start;
    left: 288px;
    transform: none;
  }
  .daydate {
    margin-top: 16px;
    text-align: center;
  }
    .daydate-txt {
      font-size: 2rem;
    }
    .daydate-arrow {
      font-size: 1.8rem;
    }
  .tab-box {
    width: 33.3333vw;
  }
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
}
</style>
