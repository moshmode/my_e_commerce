<template>

  <el-container class="home_container">

    <el-header>
      <div>Header</div>
      <el-button type="info" @click="logout()">Logout</el-button>
    </el-header>

    <el-container>
      <Aside></Aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>

import Aside from "@/components/layout/Aside";


export default {
  name: "Home",
  components: {
    Aside
  },methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }

}
</script>

<style lang="less" scoped>

.home_container {
  height: 100%;
}

.el-header {
  display: flex;
  background-color: #545c64;
  justify-content: space-between;
  line-height: 60px;
  align-items: center;
}

</style>