<template>
  <div class="task">
    <h2>Week Todos</h2>
  </div>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Week",
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
  /* .card {
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
  } */

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
