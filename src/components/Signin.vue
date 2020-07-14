<template>
  <div class="popup">
    <div class="popup-content">
      <!-- emailとpasswordの入力欄 -->
      <div class="popup-auther">
        <h1><img src="../assets/top-title.png" class="popup-title"></h1>
        <p class="popup-subtitle">サインイン ページ</p>

        <p class="popup-item">メールアドレス</p>
        <input type="email" placeholder="email" v-model="email" class="popup-input">

        <p class="popup-item">パスワード</p>
        <input type="password" placeholder="Password" v-model="password" class="popup-input">
        <button @click="signIn" class="popup-btn popup-btn__positive popup-btn__submit authuser-submit">サインイン</button>
      </div>

      <div class="popup-otherway">
        <button @click="signInWithGoogle" class="popup-auther__google"><img src="../assets/google.png"></button>
        <p class="authuser-otherway-txt">アカウントをお持ちではない方はこちら<br><router-link to="/signup" class="authuser-otherway-link">新規作成</router-link>
        </p>
      </div>
    </div>
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


<style scoped>
.popup {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #719CFC, #394E7E);
}
</style>
<style>
  .authuser {
  }
    .authuser-submit {
      display: block;
      margin: 24px auto 0;
      box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
    }
    .authuser-otherway-txt {
      margin-top: 16px;
      text-align: center;
      color: #fff;
    }
    .authuser-otherway-link {
      color: #fff;
      border-bottom: 1px solid #fff;
      font-weight: bold;
    }

    .popup-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .popup-title {
      margin: 0 auto 20px;
      display: block;
      width: 208px;
    }
    .popup-subtitle{
      text-align: center;
    }
    .popup-auther {
      box-sizing: border-box;
      padding: 16px;
      width: calc(100vw - 36px);
      background-color: #fff;
      border-radius: 8px;
      z-index: 15;
      box-shadow: 0px 3px 6px rgba(0,0,0,0.4);
    }
    .popup-input{
      width: 100%;
      font-size: 1.6rem;
      height: 20px;
      border: none;
      border-bottom: 1px solid #707070;
    }
    .popup-otherway {
      margin-top: 32px;
    }
    .popup-auther__google{
      display: block;
      margin: 0 auto;
    }

  @media screen and (min-width:1024px) {
    .popup-auther {
      max-width: 640px;
    }
  }
</style>
