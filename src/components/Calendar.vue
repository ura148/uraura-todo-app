<template>
  <div>
    <header>
      <h1>CategoList</h1>
    </header>

    <!-- Category filter radio button -->
    <div class="tabs">
      <button v-on:click="activetab=0" v-bind:class="[ activetab === 0 ? 'active' : '' ]" class="button-category">All</button>
      <button v-on:click="activetab=1" v-bind:class="[ activetab === 1 ? 'active' : '' ]" class="button-category">day</button>
      <button v-on:click="activetab=2" v-bind:class="[ activetab === 2 ? 'active' : '' ]" class="button-category">week</button>
    </div>

    <div class="content">
      <div v-show="activetab === 0" class="tabcontent">
        <ul>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'">すべて</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'">未完タスク一覧</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'">完了タスク一覧</button></li>
        </ul>

        <router-link to="/">task</router-link>

        <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id" class="card">
          <p>{{ key }}</p>
          <div v-for="(list, subkey) in taskCategory" :key="list.id">
            <template v-if="list.havechildren != 0">
              <ul class="subcard">
                  {{ list.name + "リスト"}}
                <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                  <div v-if="subtodo.todoStatus == true" class="todo">
                    <input type="checkbox" v-model="subtodo.isComplete">
                    <label v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                    {{subtodo.subDate}}
                    <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
                  </div>
                </li>
                <div>
                  <input type="text" v-model="newSubTodoName">
                  <input type="date" v-model="subDeadline">
                  <button type="button" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
                </div>
                <button type="submit" v-on:click="deleteLists(key)">削除</button>
              </ul>
            </template>
          </div>
        </div>
      </div>
      <div v-show="activetab === 1" class="tabcontent">
        <div v-if="activetab === 1" class="">
          <button type="button" v-on:click="dayCount--">◀︎</button>
          <span>{{ getTodayDate() }}</span>
          <button type="button" v-on:click="dayCount++">▶︎</button>
        </div>


        <ul>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'">すべて</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'">未完タスク一覧</button></li>
          <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'">完了タスク一覧</button></li>
        </ul>

        <router-link to="/">task</router-link>

        <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id" class="card">
          <p>{{ key }}</p>
          <div v-for="(list, subkey) in taskCategory" :key="list.id">
            <template v-if="list.havechildren != 0">
              <ul class="subcard">
                  {{ list.name + "リスト"}}
                <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                  <div v-if="todayDate == subtodo.subDate && subtodo.todoStatus == true" class="todo">
                    <input type="checkbox" v-model="subtodo.isComplete">
                    <label v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                    {{subtodo.subDate}}
                    <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
                  </div>
                </li>
                <div>
                  <input type="text" v-model="newSubTodoName">
                  <input type="date" v-model="subDeadline">
                  <button type="button" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
                </div>
                <button type="submit" v-on:click="deleteLists(key)">削除</button>
              </ul>
            </template>
          </div>
        </div>
      </div>
      <div v-show="activetab === 2" class="tabcontent">
        <template >
          <div v-if="activetab === 2" class="">
            <button type="button" v-on:click="weekCount--">◀︎</button>
            <span>{{ getWeekDate() }}</span>
            <button type="button" v-on:click="weekCount++">▶︎</button>
          </div>

          <ul>
            <li><button class="btn" type="submit" v-on:click="showTodoType = 'all'">すべて</button></li>
            <li><button class="btn" type="submit" v-on:click="showTodoType = 'active'">未完タスク一覧</button></li>
            <li><button class="btn" type="submit" v-on:click="showTodoType = 'complete'">完了タスク一覧</button></li>
          </ul>

          <router-link to="/">task</router-link>

          <div v-for="(taskCategory, key) in filteredList" :key="taskCategory.id" class="card">
            <p>{{ key }}</p>
            <div v-for="(list, subkey) in taskCategory" :key="list.id">
              <template v-if="list.havechildren != 0">
                <ul class="subcard">
                    {{ list.name + "リスト"}}
                  <li v-for="(subtodo, subsubkey) in list.subTasks" :key="subtodo.id">
                    <div v-if="startDate <= subtodo.subDate && subtodo.subDate <= endDate && subtodo.todoStatus == true" class="todo">
                      <input type="checkbox" v-model="subtodo.isComplete">
                      <label v-on:click="updateIsCompleteTodo(subkey, subtodo, list, subsubkey)">{{subtodo.subName}}</label>
                      {{subtodo.subDate}}
                      <button type="submit" v-on:click="deleteTodos(subkey, list, subsubkey)">削除</button>
                    </div>
                  </li>
                  <div>
                    <input type="text" v-model="newSubTodoName">
                    <input type="date" v-model="subDeadline">
                    <button type="button" v-on:click="createSubTodo(list, subkey)">サブタスク作成</button>
                  </div>
                  <button type="submit" v-on:click="deleteLists(key)">削除</button>
                </ul>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>

    <router-link to="/">
      <button type="button" name="makelist" class="button-round button-round__right">
        <span class="fa fa-check-square"></span>
      </button>
    </router-link>
  </div>
</template>

<script>
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
    }
  },
  created: function() {
    this.db = firebase.database();
    this.uid = firebase.auth().currentUser.uid;
    // refはreferenceでデータベースにある特定の項目を指し示すメソッド
    this.todosRef = this.db.ref("todos/" + this.uid);
    this.test = this.db.ref("todos/" + this.uid + "/");
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
    // ToDo作成
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
          start_date = start_date.getFullYear() + "年" + (start_date.getMonth() + 1) + "月" + start_date.getDate() + "日" + " (" + day.charAt( start_date.getDay() ) + ")"
      //日曜日の年月日
      let end_date = new Date(this_year, this_month, this_sunday);
          end_date = end_date.getFullYear() + "年" + (end_date.getMonth() + 1) + "月" + end_date.getDate() + "日" + " (" + day.charAt( end_date.getDay() ) +")"


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
          today_date = today_date.getFullYear() + "年" + (today_date.getMonth()+1)+ "月" + today_date.getDate() + "日" + " (" + day.charAt(today_date.getDay() ) +")"

      let planetodayDate = new Date(this_year, this_month, datex);
          planetodayDate = planetodayDate.getFullYear() + "-" + ("0"+(planetodayDate.getMonth()+1)).slice(-2) + "-" + ("0"+planetodayDate.getDate()).slice(-2)

      this.todayDate = planetodayDate;
      console.log(this.todayDate);
      return [planetodayDate, today_date];
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
