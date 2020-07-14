<template>
  <div>
    <Header/>
    <main class="main">
      <!-- Category filter radio button -->
      <div class="tab">
        <button v-on:click="activetab=0" v-bind:class="[ activetab === 0 ? 'tab-box__active' : '' ]" class="tab-box">All</button>
        <button v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'tab-box__active' : '' ]" class="tab-box">day</button>
        <button v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'tab-box__active' : '' ]" class="tab-box">week</button>
      </div>

      <div class="container">
        <div v-show="activetab === 0" class="tabcontent">
          <ul class="filter">
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">Active&Complete</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
          </ul>
          <!-- listの一覧表示 -->

          <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id">
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
        <div v-show="activetab === 1" class="tabcontent">
          <div v-if="activetab === 1" class="">
            <button type="button" v-on:click="dayCount--">◀︎</button>
            <span>{{ getTodayDate() }}</span>
            <button type="button" v-on:click="dayCount++">▶︎</button>
          </div>

          <ul class="filter">
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">Active&Complete</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
          </ul>
          <!-- listの一覧表示 -->

          <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id">
            <div class="card">
              <p class="card-category-name">{{ key }}</p>
              <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list">
              <template v-if="list.havechildren != 0">
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
                    <div v-if="todayDate == subtodo.subDate && subtodo.todoStatus == true" class="card-item">
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
                </template>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activetab === 2" class="tabcontent">
          <div v-if="activetab === 2" class="">
            <button type="button" v-on:click="weekCount--">◀︎</button>
            <span>{{ getWeekDate() }}</span>
            <button type="button" v-on:click="weekCount++">▶︎</button>
          </div>

          <ul class="filter">
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'all'">Active&Complete</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'active'">Active</button></li>
            <li class="filter-item"><button class="filter-btn" type="submit" v-on:click="showTodoType = 'complete'">Complete</button></li>
          </ul>
          <!-- listの一覧表示 -->

          <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id">
            <div class="card">
              <p class="card-category-name">{{ key }}</p>
              <div v-for="(list, subkey) in taskCategory" :key="list.id" class="card-list">
              <template v-if="list.havechildren != 0">
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
                    <div v-if="startDate <= subtodo.subDate && subtodo.subDate <= endDate && subtodo.todoStatus == true" class="card-item">
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
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <router-link to="/">
        <button type="button" name="makelist" class="button-round button-round__right">
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
            let subtodo = list.subTasks[subsubkey];
            // todoTypeがallの場合
            if (this.showTodoType == 'all') {
              subtodo.todoStatus = true;
            } else if(subtodo.isComplete == showComplete) {
              subtodo.todoStatus = true;
            }else {
              subtodo.todoStatus = false;
            }
            // 全ての期間のタスク表示
            if (this.activetab === 0){
              list.havechildren++;
            // 1日ごとのタスク表示
            }else if (this.activetab === 1){
              if (this.todayDate == subtodo.subDate){
                list.havechildren++;
              }else;
            // 週間ごとのタスク表示
            }else {
              if (this.startDate <= subtodo.subDate && subtodo.subDate <= this.endDate ) {
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
    // ToDo作成
    createTodo: function(list, subkey) {
      console.log(list.category);
      if (this.newTodoName == "") { return; }
      if (list.category == 'private') {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          todoStatus: false,
        })
      } else if (list.category == 'recruit') {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          todoStatus: false,
        })
      } else {
        this.todosRef.child(list.category).child(subkey).child("/subTasks").push({
          subName: this.newTodoName,
          isComplete: false,
          subDate: this.subDeadline,
          todoStatus: false,
        })
      }
      this.newTodoName = "";
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
    // Listを削除
    deleteLists: function(key) {
      this.todosRef.child(key).remove();
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
  }
}
</script>

<style scoped>
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
</style>
