<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 添加按钮 -->
    <el-col>
        <el-col :span="24" class="addbtn">
            <el-button type="primary">+角色</el-button>

        </el-col>
    </el-col>
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="scope">
                <!-- 页面布局 -->
                <el-row class="level1" v-for="(item1,index) in scope.row.children" :key="index">
                    <el-col :span="4">
                        <el-tag @close="deleRight(scope.row,item1.id)" closable type="success">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="20">
                        <el-row class="level2" v-for="(item2,index) in item1.children" :key="index">
                            <el-col :span="4">
                                <el-tag @close="deleRight(scope.row,item2.id)" closable type="info">{{item2.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRight(scope.row,item3.id)" closable type="warning" v-for="(item3,index) in item2.children" :key="index">{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row v-if="scope.row.children.length===0">
                    <span>该角色未分配权限</span>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column label="#" type="index">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                <el-button type="success" icon="el-icon-check" circle size="mini" plain @click="showSetRightDia(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="35%">
        <template slot-scope="scope">
            <el-tree
            ref="tree"
            :data="treelist"
            default-expand-all
            show-checkbox
            node-key="id"
             :default-checked-keys="checkArr"
             :props="defaultProps">
            </el-tree>
        </template>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRight()">确 定</el-button>
  </span>
    </el-dialog>
</el-card>

<!-- <div></div> -->
</template>

<script>
export default {
  data() {
    return {
      list: [],
      dialogVisible: false,
      // 树形结构所用的数据
      treelist: [],
      expandArr: [],
      checkArr: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 当前角色的id
      currRoleId: -1
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    // 分配/修改/更新权限
    async setRight() {
      this.dialogVisible = false
      // roles/:roleId/rights
      // roleId 当前角色的id
      // post -> {rids: 权限 ID 列表	}

      // 获取选中的label的id值 getCheckedKeys
      // 获取半选的label的id值 getHalfCheckedKeys
      // this.$refs.tree.getCheckedKeys()
      const arr1 = this.$refs.tree.getCheckedKeys()
      // console.log(arr1)
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      // console.log(arr2)
      // arr1.comcat
      // ES6 ...操作符 展开数组所有元素
      const arr = [...arr1, ...arr2]
      console.log(arr)
      // rids的值是以,分隔的字符串
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      console.log(res)
      // 更新视图
      this.loadTableData()

    },
    // 显示对话框
    async showSetRightDia(role) {
      // console.log(role)
      this.currRoleId = role.id

      this.dialogVisible = true
      // 获取所有权限
      const res = await this.$http.get(`rights/tree`)
      // console.log(res)
      this.treelist = res.data.data
      const arr = res.data.data
      const arrEmpty = []
      arr.forEach(item1 => {
        arrEmpty.push(item1.id)
        item1.children.forEach(item2 => {
          arrEmpty.push(item2.id)
          item2.children.forEach(item3 => {
            arrEmpty.push(item3.id)
          })
        })
      })
      // 获取所有权限id的数组
      this.expandArr = arrEmpty
      // 获取当前用户的角色role里面所有权限的id
      // this.checkArr = [ids]
      const arrCheck = []
      // 显示当前角色的权限
      role.children.forEach(item1 => {
        // arrCheck.push(item1.id)
        item1.children.forEach(item2 => {
          // arrCheck.push(item2.id)
          item2.children.forEach(item3 => {
            // 只需要添加最里层的节点id
            arrCheck.push(item3.id)
          })
        })
      })
      // console.log(arrCheck)
      this.checkArr = arrCheck
    },
    // // 取消权限
    async deleRight(role, rightId) {
      // roles/:roleId/rights/:rightId
      // roleId	角色 ID
      // :rightId	权限 ID
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      // console.log(res)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 200) {
        // 更新视图
        // this.loadTableData()
        // 刷新当前的数据 -> 给当前的children重新赋值
        role.children = res.data.data
      }
    },
    async loadTableData() {
      const res = await this.$http.get(`roles`)
      console.log(res)

      this.list = res.data.data
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}

.addbtn {
  margin-top: 20px;
}

.level1 {
  margin-bottom: 10px;
}

.level2 {
  margin-bottom: 10px;
}
</style>

