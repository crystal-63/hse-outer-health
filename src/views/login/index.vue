<template>
  <div class="plplpl">
    <div class="topconetnt">
      <div class="topleft">
        <img src="../../assets/img/topleft.png" style="height: 60px; margin-top: 15px" />
      </div>
      <!-- <div class="toprightmain">
        <el-dropdown>
          <div class="topright">
            <div class="phoneimg">
              <img :src="PHONE_URL" />
            </div>
            <div class="phonefont">手机版</div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div class="div4">手机扫码快速下载</div>
              <div class="div5">
                <img :src="QX_CODE" />
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>-->
    </div>
    <div class="centercontent">
      <div class="login_dailog">
        <div style="height: 100px; display: flex; justify-content: center; align-items: center">
          <div style="font-size: 24px; color: #d80f19">欢迎登录</div>
        </div>
        <div>
          <el-form :model="ruleForm" status-icon ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
            <el-form-item label="用户名" prop="loginName">
              <el-input type="text" v-model="ruleForm.loginName" autocomplete="off" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="ruleForm.password" autocomplete="off" style="width: 200px" @keyup.enter.native="dologin('ruleForm')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 200px; background-color: #c9302c; border-color: #ac2925" type="primary" @click="dologin('ruleForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { PHONE_URL, QX_CODE } from "./config";
import { common } from "../../api";
import { showMessage } from "../../utils";
import { mapState } from "vuex";

export default {
  name: "loginComponent",
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
      ruleForm: {
        loginName: localStorage.getItem("userName") || "",
        password: localStorage.getItem("password") || "",
      },
      rules: {
        loginName: [{ validator: checkAccountName, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }],
      },
      PHONE_URL: PHONE_URL,
      QX_CODE: QX_CODE,
      imageUrl: "",
    };
  },
  computed: mapState({
    userInfo: (state) => state.userInfo,
  }),
  methods: {
    dologin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          common.loginMethod(this.ruleForm).then((res) => {
            const { data } = res;
            sessionStorage.setItem("currentUserId", data.data.id);
            this.$store.commit("SET_USER", data.data);
            localStorage.setItem("xfm_password", this.ruleForm.password);
            localStorage.setItem("xfm_username", this.ruleForm.loginName);
            this.$router.push("/pages");
            this.$message.success(showMessage.loginMessage.loginsuccess);
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.plplpl {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .topconetnt {
    height: 90px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    .topright {
      display: flex;
      flex-direction: row;
      margin-top: 30px;
      .phoneimg {
        height: 30px;
        width: 17px;
        img {
          height: 100%;
          width: 100%;
        }
      }
      .phonefont {
        font-size: 14px;
        width: 49px;
        text-align: right;
        line-height: 35px;
      }
    }
  }
  .centercontent {
    height: 480px;
    margin-left: -270px;
    background-image: url("../../assets/img/loginbackground.png");
  }
}
.clverBox {
  width: 150px;
  height: 160px;
  // float: right;
  background: url(data:image/png;base64,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)
    no-repeat;
  background-size: 160px 167px;
  display: none;
  position: relative;
  z-index: 99999999;
}
.div4 {
  font-size: 12px;
  color: rgb(5, 130, 255);
  text-align: center;
}
.div5 {
  width: 110px;
  height: 110px;
  img {
    height: 100%;
    width: 100%;
  }
}

.login_dailog {
  margin-left: 72.7%;
  margin-top: 50px;
  height: 300px;
  width: 365px;
  background-color: white;
  display: flex;
  flex-direction: column;
}
.el-form-item {
  margin-bottom: 25px;
}
</style>