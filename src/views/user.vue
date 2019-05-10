<template>
    <!-- 卡片容器 -->
    <el-card>
         <!-- 面包屑 -->
         <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb> -->
        <my-bread level1="用户管理" level2="用户列表"></my-bread>
        <!-- 搜索框 -->
       <el-row>
        <el-col :span="24" class="searchArea">
            <el-input clearable v-model="searchVal" class="searchInput" placeholder="请输入内容">
                <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" @click="showDiaAddUser()">添加用户</el-button>
        </el-col>
    </el-row> 
        <!-- 表格 -->
        <el-table :data="list" style="width: 100%" v-loading="loading">
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="120">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="电话">
            </el-table-column>
            <el-table-column
            label="创建日期">
            <template slot-scope="scope">
              {{scope.row.create_time|fmtDate}}  
            </template>
            </el-table-column>
            <el-table-column  label="用户状态">
                <template slot-scope="scope">
                   <el-switch 
                   v-model="scope.row.mg_state" 
                   active-color="#13ce66" 
                   inactive-color="#ff4949"
                   @change="changeMgstate(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column  label="操作">
                <template slot-scope="scope" width="180px">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showRoledia(scope.row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
                 </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6,8]"
        :page-size="pagesize" 
        layout="total, sizes, prev, pager, next, jumper" 
        :total="total">
        </el-pagination>
         <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
            <el-form :model="formData">
            <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="formData.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" :label-width="formLabelWidth">
                <el-input v-model="formData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
                <el-input v-model="formData.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
                <el-input v-model="formData.mobile" autocomplete="off"></el-input>
            </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdduser = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">确 定</el-button>
            </div>
        </el-dialog>
         <!-- 编辑用户的对话框 -->
        <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
            <el-form :model="formData">
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="formData.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input v-model="formData.mobile" autocomplete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 分配角色的对话框 -->
            <!-- 分配角色对话框 -->
        <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRoleuser">
            <el-form>
                <el-form-item label="用户名" :label-width="formLabelWidth">
                    <!-- 需要一个用户名 -->
                    {{currUserName}}
                </el-form-item>
                <el-form-item label="角色" :label-width="formLabelWidth">
                    <el-select v-model="currRoleId">
                    <!-- v-model绑定的值 和 el-option的value值 如果一样
                        当前显示的就是该option的label值
                    -->
                        <el-option disabled label="请选择" :value="-1"></el-option>
                        <el-option
                        v-for="(item,index) in roles"
                        :key="index"
                        :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRoleuser = false">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
            </div>
        </el-dialog>
        </el-card>
</template>
<script>
export default {
    data() {
        return {
        list: [],
        loading:false,
        // 分页相关的数据
        pagesize: 2,
        total: 10,
        pagenum: 1,
        // 搜索
        searchVal:'',
        // 添加用户的对话框
         dialogFormVisibleAdduser: false,
        //  添加用户和编辑用户的form表单
        formData:{
            username:'',
            password:'',
            email:'',
            mobile:''
            },
             formLabelWidth: '140px',
            //  编辑用户
            dialogFormVisibleEdituser:false,
            // 用户id
            currUserId: -1,
            currUserName: '',
            // 分配角色的数据
            dialogFormVisibleRoleuser:false,
            // 当前用户的角色Id
            currRoleId:-1,
            roles:[],
            // 当前用户的id
            getRoleByUserId: -1
        };
    },
    mounted () {
        this.loadTableData();
        },
    methods:{
        async loadTableData(){
        this.loading=true;
             // 需要设置请求头 Authorization = token
        // const AUTH_TOKEN = sessionStorage.getItem('token')
        // // 通过axios请求的defauits给它设置一个权限为token
        // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
        const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchVal}`)
        console.log(res)
        if(res.status==200){
            this.loading=false;
            this.list=res.data.data.users;
            this.total=res.data.data.total;
            }
        },
        // 分页相关的方法
        handleSizeChange(val){
            this.pagesize=val;
            this.loadTableData();

        },
        handleCurrentChange(val){
            this.pagenum=val;
            this.loadTableData();
        },
        // 搜索用户
        async searchUser(){
            this.loadTableData();
        },
        // 修改用户状态
        async changeMgstate(user){
            const res=await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
            console.log(res);
            if(res.status==200){
                this.$message.success(res.data.meta.msg);
            }
        },
        // 删除
        showDelefirm(user){
            this.$confirm('Sure?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
         }).then(async()=>{
             const res =await this.$http.delete(`users/${user.id}`);
            //  console.log(res);
            if(res.data.meta.status==200){
                this.$message.success(res.data.meta.msg);
                this.loadTableData();
                this.pagenum=1;
            }
            
         })
        },
        // 添加用户
        showDiaAddUser(){
            this.dialogFormVisibleAdduser=true;
        },
        // 添加用户确定按钮
        async addUser(){
            this.dialogFormVisibleAdduser=false;
            const res = await this.$http.post('users',this.formData);
            // console.log(res);
            const {meta:{status,msg}}=res.data;
            if(status==201){
                //  清空表单数据
                // for (const key in this.formData) {
                // if (this.formData.hasOwnProperty(key)) {
                //     this.formData[key] = ''
                // }
                // }
                this.formData={};
                this.$message.success(msg);
                this.loadTableData();
            }
        },
        // 编辑用户信息操作
        showEditdia(user){
            this.dialogFormVisibleEdituser=true;
            this.formData=user;
            this.currUserId=user.id;
            this.currUserName=user.username;
        },
        async editUser(){
             this.dialogFormVisibleEdituser = false
            const res = await this.$http.put(`users/${this.currUserId}`,this.formData);
            // console.log(res)
            const {meta:{msg,status}}=res.data;
            if(status==200){
                this.$message.success(msg);
                this.loadTableData();
            }
        },
        // 分配角色     
        async showRoledia(user){
            // console.log(user);
            this.dialogFormVisibleRoleuser=true;
            this.currUserName=user.username;
            const res= await this.$http.get(`roles`);
            // console.log(res);
            this.getRoleByUserId=user.id;
            this.roles=res.data.data;
           const res1 = await this.$http.get(`users/${user.id}`)
            // console.log(res1);
            this.currRoleId=res1.data.data.rid;
        },
        async setRole(){
             this.dialogFormVisibleRoleuser=false;
            //  const res = await this.$http.put(`users/${ this.getRoleByUserId}/role/${this.currRoleId}`);
             const res = await this.$http.put(`users/${this.getRoleByUserId}/role`, {rid: this.currRoleId})
            //  console.log(res);
             if(res.data.meta.status==200){
                 this.$message.success(res.data.meta.msg);
             }
        }

    },
   
};
</script>
<style>
.box-card {
    height: 100%;
}

.searchArea {
    margin-top: 10px;
    margin-bottom: 10px;
}

.searchArea .searchInput {
    width: 350px;
}
</style>

