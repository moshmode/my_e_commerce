<template>
  <div class="login_container">
    <div class="login_box">
      <!--头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt=""/>
      </div>

      <div class="login_form">
        <el-form ref="loginFormRef" :model="loginData" :rules="login_rules">

          <el-form-item prop="username">
            <el-input v-model="loginData.username" prefix-icon="el-icon-user" placeholder="Please input your username"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginData.password" prefix-icon="el-icon-lock" placeholder="Please input your password"
                      show-password></el-input>
          </el-form-item>

          <el-form-item class="login_button">
            <el-button type="primary" @click="login()">Login</el-button>
            <el-button type="info" @click="resetForm()">Reset</el-button>
          </el-form-item>

        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      },
      login_rules: {

        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
        ]
      }

    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(
          valid => {
            if (!valid)
              return;
            this.$http({
              url: 'http://localhost:8080/user/check',
              method: 'POST',
              params: this.loginData
            }).then(respose => (console.log(respose)))
          }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: aliceblue;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eeeeee;
  }
}

.login_button {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}

</style>