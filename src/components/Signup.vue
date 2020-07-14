<template>
  <div class="popup">
    <div class="popup-content">
      <div class="popup-auther">
        <h1><img src="../assets/top-title.png" class="popup-title"></h1>
        <p class="popup-subtitle">サインアップ ページ</p>

        <p class="popup-item">新規メールアドレス</p>
        <input type="email" placeholder="email" v-model="email" class="popup-input">

        <p class="popup-item">新規パスワード</p>
        <input type="password" placeholder="password" v-model="password" class="popup-input">

        <button @click="signUp" class="popup-btn popup-btn__positive popup-btn__submit authuser-submit">登録</button>

      </div>
      <!-- 登録フォーム -->
      <div class="popup-otherway">
        <!-- サインインへの遷移ボタン -->
        <p class="authuser-otherway-txt">アカウントをお持ちの方はこちら<br><router-link to="/signin" class="authuser-otherway-link">サインページ</router-link></p>

      </div>


    </div>
  </div>
</template>


<script>
import firebase from "firebase"; // firebaseのインポート


export default {
  name: "Singup",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    // singUpボタンが押されたときに実行されるfunctrion
    signUp: function() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        // .then(user => {alert("Create account: " + user.user.email);})
        .then(user => {
          // 成功時
          alert("Create account: " + user.user.email);
          this.$router.push("/signin");
        })
        .catch(error => {
          // 失敗時
          alert(error.message);
        });
    }
  }
};
</script>


<style scoped>
.popup {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #719CFC, #394E7E);
}
</style>
