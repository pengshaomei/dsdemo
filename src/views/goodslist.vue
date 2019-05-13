<template>
<el-card class="box-card">
    <!-- 面包屑 -->
  <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索框 -->
    <el-row>
        <el-col :span="24" class="searchArea">
            <el-input clearable v-model="searchVal" class="searchInput"
            placeholder="请输入内容">
                <el-button  slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" @click="showDiaAddGoods()">添加商品</el-button>
        </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
    height="450"
   :data="list" style="width: 100%">
        <el-table-column type="index" label="#" width="80">
        </el-table-column>

        <el-table-column prop="goods_name" label="商品名称" width="300">
        </el-table-column>

        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>

        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>

        <!-- filter {{msg|过滤器}}  v-bind=""-->
        <el-table-column label="创建日期">
            <template slot-scope="scope">
                {{scope.row.add_time | fmtDate}}
            </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
            </template>
        </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page="pagenum"
     :page-sizes="[50, 100, 150,200]"
     :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
     :total="total">
    </el-pagination>



</el-card>
</template>

<script>
export default {
  data() {
    return {
      searchVal: '',
      list: [],
      pagenum:1,
      pagesize:100,
      total:1
    }
  },
  created() {
    this.getGoods()
  },
  methods: {
     // 分页的相关方法
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      this.getGoods()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // this.pagenum = 2 = val
      this.pagenum = val
      this.getGoods()
    },
    // 获取商品数据
    async getGoods() {
      const res = await this.$http.get(
        `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
          this.searchVal
        }`
      )
      console.log(res)
      this.list = res.data.data.goods
      this.total = res.data.data.total
    },
    showDiaAddGoods() {
      this.$router.push({name:'goodsadd'})
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
