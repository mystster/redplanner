<template>
  <div id="app">
    <b-navbar class="is-primary-background">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Redplanner
        </b-navbar-item>
      </template>
      <template slot="start">
        <b-navbar-item tag="router-link" :to="{ path: '/redmine' }">
          Redmine View
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/about' }">
          About
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item tag="router-link" :to="{ path: '/setting' }">
          Setting
        </b-navbar-item>
      </template>
    </b-navbar>
    <section class="hero is-fullheight-with-navbar">
      <div class="hero-head">
        <keep-alive include="TabBrowser">
          <router-view />
        </keep-alive>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

::-webkit-scrollbar {
  display: none;
}
</style>
