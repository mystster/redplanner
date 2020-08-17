<template>
  <div id="app">
    <el-container>
      <el-aside width="100px">
        <el-menu :router="true">
          <el-menu-item index="Redmine view" :route="{ name: 'Redmine view' }"
            >Redmine View</el-menu-item
          >
          <el-menu-item index="Home" :route="{ name: 'Home' }"
            >Home</el-menu-item
          >
          <el-menu-item index="Tab" :route="{ name: 'Tab' }">Tab</el-menu-item>
          <el-menu-item index="About" :route="{ name: 'About' }"
            >About</el-menu-item
          >
          <el-menu-item index="Setting" :route="{ name: 'Setting' }"
            >Setting</el-menu-item
          >
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}

.el-main {
  padding: 0px;
}

body {
  margin: 0px;
}
</style>
