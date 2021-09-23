<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">


      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入用户名" v-model="name">
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addButton()">添加用户</el-button>
        </el-col>
      </el-row>

      <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
        <el-form :model="user">
          <el-form-item label="用户名" label-width="100px">
            <el-input v-model="user.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" label-width="100px">
            <el-input v-model="user.password" autocomplete="off" show-password></el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="100px">
            <el-input v-model="user.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="权限" label-width="100px">
            <el-radio-group v-model="user.right">
              <el-radio :label="0">管理员</el-radio>
              <el-radio :label="1">普通用户</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </div>
      </el-dialog>

      <el-table
          :data="userList"
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
            prop="password"
            label="PASSWORD">
        </el-table-column>
        <el-table-column
            prop="email"
            label="EMAIL">
        </el-table-column>
        <el-table-column
            prop="right"
            label="Right">
          <template slot-scope="scope">
            <span>{{ scope.row.right === 0 ? 'admin' : 'user' }}</span>
          </template>

        </el-table-column>
        <el-table-column
            label="OPERATION">
          <template slot-scope="scope">
            <el-button
                size="mini"
                icon="el-icon-edit"
                @click="updateButton(scope.row)">
            </el-button>
            <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteUser(scope.row.id)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.pageNow"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="this.pageParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="count"
        hide-on-single-page>
    </el-pagination>

  </div>


</template>

<script>
export default {
  name: "Users",
  data() {
    return {
      name: '',
      userList: [],
      pageParams: {
        pageNow: 1,
        pageSize: 5
      },
      user: {
        name: '',
        password: '',
        email: '',
        right: ''
      },
      dialogFormVisible: false,
      editState: 0,
      count: 0
    }
  },
  methods: {
    searchUser() {
      if (this.name === '') {
        this.listUser()
        return
      }

      this.$http({
        url: 'http://localhost:8080/user/search',
        method: 'GET',
        params: {
          name: this.name
        }
      }).then(response => {
        this.userList.length = 0
        this.userList.unshift(response.data)
      })
    },

    listUser() {
      this.$http({
        url: 'http://localhost:8080/user/list',
        method: 'GET',
        params: this.pageParams
      }).then(response => {
        this.userList = response.data
      })
    },

    editUser() {
      if (this.editState === 0) {
        this.addUser()
        return
      }
      this.updateUser(this.user)
    },

    addButton() {
      this.editState = 0
      this.dialogFormVisible = true;
    },

    addUser() {
      this.dialogFormVisible = false
      this.$http({
        url: 'http://localhost:8080/user/add',
        method: 'POST',
        params: this.user
      }).then(response => {
        if (response.status === 200 || response.data.message == null) {
          this.$message.success('add successfully')
          this.listUser()
          this.getCount()
          return
        }
        this.$message.error(response.data.message)
      })

    },

    deleteUser(id) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: 'http://localhost:8080/user/delete',
          method: 'GET',
          params: {
            id: id
          }
        }).then(response => {
          if (response.status === 200 || response.data.message == null) {
            this.$message.success('delete successfully')
            this.listUser()
            this.getCount()
            return
          }
          this.$message.error(response.data.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    updateButton(row) {
      this.user = row
      this.editState = 1
      this.dialogFormVisible = true;
    },

    updateUser(row) {
      this.dialogFormVisible = false
      this.$http({
        url: 'http://localhost:8080/user/update',
        method: 'POST',
        params: row
      }).then(response => {
        if (response.status === 200 || response.data.message == null) {
          this.$message.success('update successfully')
          return
        }
        this.$message.error(response.data.message)
      })
    },

    getCount() {
      this.$http({
        url: 'http://localhost:8080/user/count',
        method: 'GET',
      }).then(response => {
        this.count = response.data
      })
    },

    handleSizeChange(val) {
      this.pageParams.pageSize = val
      this.listUser()
    },

    handleCurrentChange(val) {
      this.pageParams.pageNow = val
      this.listUser()
    }
  },
  mounted() {
    this.listUser()
    this.getCount()
  }
}
</script>

<style scoped>

.box-card {
  width: 100%;
  margin-top: 20px;
}

.el-table {
  margin-top: 15px;
  font-size: 12px;
}

</style>