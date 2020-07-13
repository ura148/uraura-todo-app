<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */

/* reset css */
  html, body, div, span, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  abbr, address, cite, code,
  del, dfn, em, img, ins, kbd, q, samp,
  small, strong, sub, sup, var,
  b, i,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section, summary,
  time, mark, audio, video {
    margin:0;
    padding:0;
    border:0;
    outline:0;
    font-size:100%;
    vertical-align:baseline;
    background:transparent;
    font-weight: normal;
  }

  body {
      line-height:1;
  }

  article,aside,details,figcaption,figure,
  footer,header,hgroup,menu,nav,section {
      display:block;
  }

  ul{
    list-style-type: none;
  }

  nav ul {
      list-style:none;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
      quotes:none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
      content:'';
      content:none;
  }

  a {
    text-decoration:none;
    margin:0;
    padding:0;
    font-size:100%;
    vertical-align:baseline;
    background:transparent;
  }

  button{
          background-color: transparent;
          border: none;
          cursor: pointer;
          outline: none;
          padding: 0;
          appearance: none;
  }

  /* change colours to suit your needs */
  ins {
      background-color:#ff9;
      color:#000;
      text-decoration:none;
  }

  /* change colours to suit your needs */
  mark {
      background-color:#ff9;
      color:#000;
      font-style:italic;
      font-weight:bold;
  }

  del {
      text-decoration: line-through;
  }

  abbr[title], dfn[title] {
      border-bottom:1px dotted;
      cursor:help;
  }

  table {
      border-collapse:collapse;
      border-spacing:0;
  }

  /* change border colour to suit your needs */
  hr {
      display:block;
      height:1px;
      border:0;
      border-top:1px solid #cccccc;
      margin:1em 0;
      padding:0;
  }

  input, select {
      vertical-align:middle;
  }

  /* clearfix */
  .clearfix:after {
      content:"";
      display:table;
      clear:both;
  }

/* style.css */
  html{
    font-size:62.5%;/*16px×62.5％＝10px*/
  }

  body {
    -webkit-text-size-adjust: 100%;
    text-size-adjust: 100%;
    color: #ffffff;
    font-family: '','a-otf-ryumin-pr6n', sans-serif;
    font-size: 1.6rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: antialiased;
    letter-spacing: 0.05rem;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

.card {
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
}
</style>
