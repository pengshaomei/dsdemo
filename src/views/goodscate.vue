<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 搜索框 -->
    <el-row>
        <el-col :span="24" class="searchArea">
            <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
        </el-col>
    </el-row>
       <!-- 添加分类的对话框 -->
    <el-dialog title="修改分类名称" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
            <el-button type="primary" @click="editCate()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 级联选择器 (表单元素) -->
            <el-form-item label="分类" :label-width="formLabelWidth">
              {{selectedOptions}}
                <el-cascader
                expand-trigger="hover"
                change-on-select
                clearable
                :options="caslist"
                v-model="selectedOptions" :props="defaultProp">
                </el-cascader>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table height="450" :data="list" style="width: 100%">

        <!--  ElTreeGrid 等价于 el-tree-grid
      treeKey	default:'id' 每个节点的标识 id
      parentKey	父节点的key值
      levelKey 当前节点是第几级
      childKey	子节点的key

    -->
        <el-tree-grid prop="cat_name" label="分类名称" width="140" treeKey="cat_id" parentKey="cat_pid" levelKey="cat_level" childKey="children">

        </el-tree-grid>

        <!-- <el-table-column prop="cat_name" label="分类名称" width="140">
        </el-table-column> -->

        <el-table-column label="级别">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level===0">一级</span>
                <span v-else-if="scope.row.cat_level===1">二级</span>
                <span v-else-if="scope.row.cat_level===2">三级</span>
            </template>
        </el-table-column>

        <el-table-column label="是否有效">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted===false">有效</span>
                <span v-else-if="scope.row.cat_deleted===true">无效</span>
            </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary"
                icon="el-icon-edit" circle size="mini" plain
                @click="showEditdia(scope.row)"></el-button>
                <el-button type="danger"
                icon="el-icon-delete" circle size="mini" plain
                @click="showDelefirm(scope.row)"></el-button>
            </template>
        </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[5, 10, 15,20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

</el-card>
</template>

<script>
// 导入包
const ElTreeGrid = require('element-tree-grid')

export default {
  components: {
    // 自定义标签名:导入的对象ElTreeGrid
    ElTreeGrid
  },
  data() {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit:false,
      form: {
        cat_pid: -1,
        cat_name: '',
        cat_level: -1
      },
      formLabelWidth: '140px',
      //  级联选择器要用的数据
      caslist: [],
      //  级联选择器选中的数据
      selectedOptions: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  created() {
    this.getGoodsCate()
  },
  methods: {
    // 编辑分类 - 发送请求
    async editCate(){

      const res = await this.$http.put(`categories/${this.form.cat_id}`,{
        cat_name:this.form.cat_name
      })
      // console.log(res)
      this.$message.success(res.data.meta.msg)
      this.dialogFormVisibleEdit = false
      this.getGoodsCate()

    },
    // 编辑分类 - 显示对话框
    showEditdia(cat){
      this.dialogFormVisibleEdit = true
      this.form.cat_name = cat.cat_name
      this.form.cat_id = cat.cat_id
    },
    // 删除分类
    showDelefirm(cat) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //
          const res = await this.$http.delete(`categories/${cat.cat_id}`)
          // console.log(res)
          const {
            meta: { status, msg }
          } = res.data
          if (status === 200) {
            this.getGoodsCate()
            this.$message({
              type: 'success',
              message: msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加分类 - 发送请求
    async addCate() {
      // 关闭对话框
      this.dialogFormVisibleAdd = false
      // 如果未选择 添加的是第一级
      // 如果选择了一个 添加的第二级
      // 如果选择了二个 添加的第三级
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0
        // this.form.cat_level = 0
      } else if (this.selectedOptions.length === 1) {
        this.form.cat_pid = this.selectedOptions[0]
        // this.form.cat_level = 1
      } else if (this.selectedOptions.length === 2) {
        this.form.cat_pid = this.selectedOptions[1]
        // this.form.cat_level = 2
      }
      this.form.cat_level = this.selectedOptions.length

      // 发送请求
      const res = await this.$http.post(`categories`, this.form)
      // console.log(res)
      const {
        meta: { status, msg }
      } = res.data
      if (status === 201) {
        this.$message.success(msg)
        this.getGoodsCate()
      } else {
        this.$message.warning(msg)
      }
    },
    // 获取所有分类
    async getGoodsCate() {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      // console.log(res)
      this.list = res.data.data.result
      this.total = res.data.data.total
    },
    // 分页的相关方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoodsCate()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      // this.pagenum = 2 = val
      this.pagenum = val
      this.getGoodsCate()
    },
    // 添加分类- 显示对话框
    async addGoodsCate() {
      this.dialogFormVisibleAdd = true
      // 获取分类数据(二级)
      const res = await this.$http.get(`categories?type=2`)
      // console.log('-----');

      // console.log(res)
      this.caslist = res.data.data
    }
  }
}
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

// element-ui组件库中的el-table没有树形结构
// 用下面这三个包可以实现该效果
// 在npm中搜索关键字 vue tree grid table等

// vue-table-with-tree-grid(替换了整个el-table))
// element-tree-grid (只是对el-table中的单元格进行增强)
// prop data
// vue-tree-table(替换了整个el-table)
