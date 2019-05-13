<template>
<div class="login-wrap">
<el-form
label-position="top"
label-width="80px"
class="login-form">
  <h2>用户登录</h2>
    <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
    </el-form-item>
      <el-button @click="handleLogin()"
      type="primary"
      class="login-button"
      >登录</el-button>
</el-form>
</div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await this.$http.post('login', this.formdata)
      const { meta } = res.data
      if (meta.status === 200) {
        // sessionStorage
      // 保存token值
        const token = res.data.data.token
        sessionStorage.setItem('token', token)

        this.$message.success(meta.msg)
        this.$router.push({ name: 'home' })
      } else {
        this.$message.error(meta.msg)
      }
    }

    // handleLogin(){
    //   // 获取表单数据 this.formdata
    //   // 发送post
    //   this.$http.post('login',this.formdata)
    //   .then((res)=>{
    //     console.log(res)//
    //     const {meta} = res.data
    //     if (meta.status===200) {
    //       this.$message.success(meta.msg);
    //       // 跳转
    //       this.$router.push({name:'home'})
    //     } else {
    //       // 提示框 meta.msg
    //         this.$message.error(meta.msg);
    //     }
    //   })
    // }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-form .login-button {
  width: 100%;
}
</style>
