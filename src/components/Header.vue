<template>
  <header class="header">
    <div class="header-container">
      <h1>
        <img src="../assets/title.png" class="header-title">
      </h1>
      <!-- <button type="button" v-on:click="signOut()">Sign out</button> -->
    </div>

  </header>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Header",
  methods: {
    signOut: function () {
      firebase.auth().signOut().then(() => {
        this.$router.push('/signin')
      })
    }
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
    width: 83px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
