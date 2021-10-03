<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="right-card">


      <el-table
          :data="rightList"
          style="width: 100%"
          border
      >

        <el-table-column
            prop="id"
            label="ID"
            type="index"
            width="50px">
        </el-table-column>
        <el-table-column
            prop="name"
            label="NAME">
        </el-table-column>
        <el-table-column
            prop="path"
            label="PATH">
        </el-table-column>
        <el-table-column
            label="LEVEL">
          <template slot-scope="scope">
            <span>{{ getLevel(scope.row.id) }}</span>
          </template>
        </el-table-column>


      </el-table>

    </el-card>

  </div>
</template>

<script>
export default {
  name: "RightList",
  data() {
    return {
      rightList: []
    }
  },
  methods: {
    getLevel(id) {
      if (id < 10)
        return 1
      if (id < 100)
        return 2
      return 3
    }
  },
  mounted() {
    this.$http({
      url: 'http://localhost:8080/roleRight/listRight',
      method: 'GET',
    }).then(response => {
      this.rightList = response.data
    })
  }
}
</script>

<style lang="less" scoped>

.right-card {
  margin-top: 20px;
}

</style>