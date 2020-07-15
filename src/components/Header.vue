<template>
  <header class="header">
    <div class="header-container">
      <h1>
        <img src="../assets/title.png" class="header-title">
      </h1>
      <button type="button" v-on:click="signOut()" class="header-signout">Sign out</button>

      <!-- Make list button -->
      <button type="button" name="makelist" v-if="windowW >= 1024" @click="show=!show" v-bind:class="{actives: show}" class="header-btn header-btn__addlist">
        <span class="fa fa-list"></span>
      </button>

      <!-- Make list contents -->
      <div v-show="show" class="popup">
        <div class="popup-fix__todo">
          <p class="popup-item">List name</p>
          <input type="text" v-model="newlistName" class="popup-input">

          <p class="popup-item">Category</p>
          <select v-model="selectCategory" class="popup-input">
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

      <router-link to="/calendar" v-if="windowW >= 1024">
        <button type="button" v-if="windowW >= 1024 && $route.path == '/'" class="header-btn header-btn__changemode">
          <span class="fa fa-calendar-check-o"></span>
        </button>
      </router-link>

      <router-link to="/" v-if="windowW >= 1024">
        <button type="button" v-if="windowW >= 1024 && $route.path == '/calendar'" class="header-btn header-btn__changemode">
          <span class="fa fa-check-square"></span>
        </button>
      </router-link>
    </div>
  </header>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Header",
  data() {
    return {
      show: false,
      newlistName: '',
      windowW: window.innerWidth,
      windowH: window.innerHeight,
      selectCategory: '',
      options: [
        { text: 'bucket list', value: 'bucket list' },
        { text: 'private', value: 'private' },
        { text: 'recruit', value: 'recruit' },
      ],
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
  methods: {
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
    handleResize: function() {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      this.windowW = window.innerWidth;
      this.windowH = window.innerHeight;
    },
    signOut: function () {
      firebase.auth().signOut().then(() => {
        this.$router.push('/signin')
      })
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
.header {
  position: fixed;
  z-index: 3;
  top: 0;
  width: 100%;
  height: 48px;
  background-color: #719CFC;
}
  .header-container {
    align-items: center;
  }
  .header-title {
    width: 160px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .header-signout {
    position: absolute;
    top: 50%;
    right: 18px;
    transform: translateY(-50%);
    color: #fafafa;
  }
  .header-btn {
    position: absolute;
    padding: 4px 16px;
    background-color: #fff;
    border-radius: 8px;
    font-size: 1.6rem;
    color: #719CFC;
    box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
  }
    .header-btn__addlist {
      top: 10px;
      left: 18px;
    }
    .header-btn__changemode {
      top: 10px;
      left: 86px;
    }
</style>
