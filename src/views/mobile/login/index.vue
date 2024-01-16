<template>
  <div class="pageContent">
    <div class="page-logo"></div>
    <!-- <h1>登录页面</h1> -->
    <div class="form_content">
      <el-form label-position="top" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" :prop="'loginName'">
          <el-input v-model.number="ruleForm.loginName" placeholder="请输入用户编号"></el-input>
        </el-form-item>
        <el-form-item label="密码" :prop="'password'">
          <el-input show-password type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="loginBtn">
      <el-button style="width: 100%" type="primary" @click="login">登录</el-button>
    </div>
  </div>
</template>
<script>
import { common } from "../../../api";
import { showMessage } from "../../../utils";

export default {
  name: "mobileLogin",
  data() {
    const checkAccountName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const checkPassword = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      rules: {
        password: [{ validator: checkPassword, trigger: "blur" }],
        loginName: [{ validator: checkAccountName, trigger: "blur" }],
      },
      ruleForm: {
        loginName: localStorage.getItem("xfm_username"),
        password: localStorage.getItem("xfm_password"),
      },
    };
  },
  methods: {
    login() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          common.loginMethod(this.ruleForm).then((res) => {
            const { data } = res;
            sessionStorage.setItem("currentUserId", data.data.id);
            this.$store.commit("SET_USER", data.data);
            localStorage.setItem("xfm_password", this.ruleForm.password);
            localStorage.setItem("xfm_username", this.ruleForm.loginName);
            this.$router.push("/");
            this.$message.success(showMessage.loginMessage.loginsuccess);
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pageContent {
  width: 100%;
  height: 100%;
}
.form_content {
  width: 80%;
  margin: 0 auto;
}
.loginBtn {
  width: 80%;
  margin: 10px auto;
}
::v-deep .el-form-item__label {
  font-size: 18px;
  font-weight: 500;
}
.page-logo {
  width: 240px;
  height: 50px;
  margin: 40px auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url("../../../assets/img/topleft.png");
  background-size: 100% 100%;
}
</style>