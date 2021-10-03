<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="role-card">

      <el-button type="primary"
                 @click="addRole">
        ADD ROLE
      </el-button>

      <el-table
          :data="roleList"
          style="width: 100%"
          border>

        <el-table-column
            type="expand">
          <template slot-scope="scope">
            <el-row :class="[index===0?'tree-row-top':'','tree-row-bottom','item_center']"
                    v-for="(item,index) in scope.row.rightList"
                    :key="item.id">
              <el-col :span="5" type="flex">
                <el-tag effect="dark"
                        closable
                        @close="deleteRight(scope.row.id,item.id,scope.row.rightList)">
                  {{ item.name }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[nextIndex===0?'':'tree-row-top','item_center']"
                        v-for="(nextItem,nextIndex) in item.children"
                        :key="nextItem.id">
                  <el-col :span="6">
                    <el-tag effect="dark"
                            type="success"
                            closable
                            :disable-transitions="false"
                            @close="deleteRight(scope.row.id,nextItem.id,item.children)">
                      {{ nextItem.name }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag effect="dark"
                            type="warning"
                            closable
                            :class="[finalIndex===0?'':'tree-row-top']"
                            v-for="(finalItem,finalIndex) in nextItem.children"
                            :key="finalItem.id"
                            @close="deleteRight(scope.row.id,finalItem.id,nextItem.children)">
                      {{ finalItem.name }}
                    </el-tag>
                  </el-col>

                </el-row>
              </el-col>
            </el-row>

          </template>
        </el-table-column>
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
            label="OPERATION">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="editButton(scope.row)">
              编辑
            </el-button>

            <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteRole(scope.row.id)">
              删除
            </el-button>

            <el-button
                size="mini"
                type="warning"
                icon="el-icon-delete"
                @click="grantButton(scope.row)">
              分配权限
            </el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-dialog title="编辑角色" :visible.sync="dialogTableVisible">
        <el-form :model="isEditing">
          <el-form-item label="NAME" label-width="100px">
            <el-input v-model="isEditing.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="分配权限" :visible.sync="dialogTreeVisible"
                 @close="resetDefaultKeys()"
                 @opened="dialogOpend">
        <el-tree
            ref="tree"
            :data="rightTree"
            show-checkbox
            node-key="id"
            :props="treeProps">
        </el-tree>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTreeVisible = false">取 消</el-button>
          <el-button type="primary" @click="grantRight">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>

  </div>
</template>

<script>
export default {
  name: "RoleList",
  data() {
    return {
      roleList: [],
      roleRightList: [],
      rightTree: [],
      treeProps: {
        label: 'name',
        children: 'children'
      },
      dialogTableVisible: false,
      dialogTreeVisible: false,
      isEditing: {},
      isGranting: {},
      checkedKeys: [],
    }
  },
  methods: {
    listRole() {
      this.$http({
        url: 'http://localhost:8080/role/listRole',
        method: 'GET',
      }).then(response => {
        this.roleList = response.data
      })
    },
    editButton(row) {
      this.isEditing.id = row.id
      this.isEditing.name = row.name

      this.dialogTableVisible = true
    },
    editRole() {
      this.dialogTableVisible = false
      this.$http({
        url: 'http://localhost:8080/role/editRole',
        method: 'POST',
        params: {
          id: this.isEditing.id,
          name: this.isEditing.name
        }
      }).then(response => {
        if (response.status === 200 && response.data.message == null) {
          this.$message.success(response.data)
          return
        }
        this.$message.error(response.data.message)
      })
    },
    deleteRole(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$http({
          url: 'http://localhost:8080/role/deleteRole',
          method: 'GET',
          params: {
            id: id
          }
        }).then(response => {
          if (response.status === 200 && response.data.message == null) {
            this.listRole()
            this.$message.success(response.data)
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
    addRole() {
      this.$prompt('请输入要添加的role的名字', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({value}) => {
        this.$http({
          url: 'http://localhost:8080/role/addRole',
          method: 'POST',
          params: {
            name: value
          }
        }).then(response => {
          if (response.status === 200 && response.data.message == null) {
            this.$message.success(response.data)
            this.listRole()
            return
          }
          this.$message.error(response.data.message)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    treeRight() {
      this.$http({
        url: 'http://localhost:8080/roleRight/treeRight',
        method: 'GET',
      }).then(response => {
        if (response.status === 200 && response.data.message == null) {
          this.rightTree = response.data
        }
      })
    },
    deleteRight(roleId, rightId, superList) {
      this.$http({
        url: 'http://localhost:8080/roleRight/deleteRoleRight',
        method: 'GET',
        params: {
          roleId: roleId,
          rightId: rightId
        }
      }).then(response => {
        if (response.status === 200 && response.data.message == null) {
          this.$message.success(response.data)
          superList.forEach(function (item, index) {
            if (item.id === rightId) {
              superList.splice(index, 1)
            }
          })
          return
        }
        this.$message.error(response.data.message)
      })
    },
    grantRight() {
      const keys = [
        ...this.$refs.tree.getHalfCheckedKeys(),
        ...this.$refs.tree.getCheckedKeys()
      ]

      const keysStr = keys.join(',')

      this.$http({
        url: 'http://localhost:8080/roleRight/addRoleRight',
        method: 'POST',
        params: {
          roleId: this.isGranting.id,
          rightKeys: keysStr
        }
      }).then(
          response => {
            if (response.status === 200 && response.data.message == null) {
              this.listRole()
              this.$message.success(response.data)
              return
            }
            this.$message.error(response.data.message)
          }
      )

      this.dialogTreeVisible = false
    },
    grantButton(row) {
      this.isGranting = row
      row.rightList.forEach(item => {
        this.getLeafKey(item)
      })

      this.dialogTreeVisible = true
    },
    dialogOpend() {
      this.$refs.tree.setCheckedKeys(this.checkedKeys)
    },
    getLeafKey(node) {
      if (node.id > 100)
        return this.checkedKeys.push(node.id)

      node.children.forEach(item => {
        this.getLeafKey(item)
      })

    },
    resetDefaultKeys() {
      this.checkedKeys = []
      this.$refs.tree.setCheckedKeys(this.checkedKeys)
    }

  },
  mounted() {
    this.listRole()
    this.treeRight()
  }
}
</script>

<style lang="less" scoped>

.role-card {
  margin-top: 20px;
}

.el-tag {
  margin: 8px;
}

.tree-row-top {
  border-top: 1px solid #eee;
}

.tree-row-bottom {
  border-bottom: 1px solid #eee;
}

.item_center {
  display: flex;
  align-items: center;
}
</style>