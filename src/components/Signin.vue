<template>
  <div id="signin">
    <h2>サインイン</h2>

    <!-- emailとpasswordの入力欄 -->
    <input type="email" placeholder="email" v-model="email">
    <input type="password" placeholder="Password" v-model="password">
    <button @click="signIn">Signin</button>

    <!-- googleのアカウントでサインイン。アカウントがなければ新規に作成されます。 -->
    <button @click="signInWithGoogle">Googleアカウントでサインイン</button>

    <p>
      アカウントをお持ちではない方
      <router-link to="/signup">新規作成</router-link>
    </p>
  </div>
</template>

<script>
import firebase from "firebase"; // firebaseのインポート

export default {
  name: "Signin",
  data() {
    return {
      email: "",
      password: ""
    };
  },
  methods: {
    // signinボタンを押したときに実行されるfunction
    signIn: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(user => {
          // ログインが成功した場合にメインページに遷移させる
          alert("success : " + user.user.email);
          this.$router.push("/");
        })
        .catch(error => {
          // ログインに失敗した場合
          alert(error.message);
        });
    },
    // googleでサインインするときに呼ばれるfunction
    signInWithGoogle: function() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(user => {
          // 削除する可能性あり
          console.log("success : " + user.user.email);
          // alert("success : " + user.user.email);
          this.$router.push("/");
        }).catch(
          error => {
            alert(error.message)
          }
        );
    }
  }
};
</script>


<style>
</style>
