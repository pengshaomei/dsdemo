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
      <el-button
      type="primary"
      class="login-button"
      @click="handleLogin"
      >登录</el-button>
</el-form>
</div>
</template>
<script>
export default {
    data(){
        return{
            formdata:{
                username:'',
                password:''
            }
        }
    },
   methods: {
        async handleLogin(){
        //    发送表单请求
        const res=await this.$http.post('login',this.formdata);
         const result=res.data;
            if(result.meta.status==200){
                const token=result.data.token;
                sessionStorage.setItem('token',token);
                this.$message.success(result.meta.msg);
                this.$router.push({name:'home'});
            }else{
                this.$message.error(result.meta.msg);
            }
       }
    //    handleLogin(){
    //     //    发送表单请求
    //     this.$http.post('login',this.formdata)
    //     .then((res)=>{
    //         // console.log(res)
    //         const result=res.data;
    //         if(result.meta.status==200){
    //             this.$message.success(result.meta.msg);
    //             this.$router.push({name:'home'});
    //         }else{
    //             this.$message.error(result.meta.msg);
    //         }
    //     })
    //    }
   },
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
html,
body,
h2 {
    height: 100%;
    padding: 0;
    margin: 0;
}
</style>
