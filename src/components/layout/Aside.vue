<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="shrink">|||</div>
    <el-menu
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#409EFF"
        unique-opened
        :collapse="isCollapse"
        :collapse-transition="false"
        router
        :default-active="prePath">
      <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconNum[item.id]"></i>
          <span>{{ item.name }}</span>
        </template>

        <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id"
                      @click="saveMenuState(subItem.path)">
          <i :class="iconNum[subItem.id]"></i>
          <span slot="title"> {{ subItem.name }}</span>
        </el-menu-item>
      </el-submenu>

    </el-menu>

  </el-aside>
</template>

<script>
export default {
  name: "Aside",
  data() {
    return {
      menuList: [],
      isCollapse: false,
      prePath: '',
      iconNum: {
        '1': 'el-icon-user-solid',
        '11': 'el-icon-user',
        '2': 'el-icon-s-grid',
        '21': 'el-icon-menu',
        '22': 'el-icon-s-custom',
        '3': 'el-icon-s-shop',
        '31': 'el-icon-s-goods',
        '32': 'el-icon-s-tools',
        '33': 'el-icon-goods',
        '4': 'el-icon-document-copy',
        '41': 'el-icon-tickets',
        '5': 'el-icon-s-data'
      }
    }
  },
  methods: {
    shrink() {
      this.isCollapse = !this.isCollapse
    },
    saveMenuState(prePath) {
      window.sessionStorage.setItem('prePath', prePath)
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.$http({
        url: 'http://localhost:8080/user/menu',
        method: 'GET'
      }).then(response => {
        this.menuList = response.data
      })

      this.prePath = window.sessionStorage.getItem('prePath')

    })
  }
}
</script>

<style lang="less" scoped>
.el-aside {
  background-color: #545c64;
  line-height: 200px;

  .el-menu {
    border-right: none;
  }
}

.toggle-button {
  background-color: #545c64;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>