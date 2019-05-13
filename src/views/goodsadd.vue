<template>
<el-card class="box-card">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <el-alert class="info" title="添加商品信息" type="success" center show-icon>
    </el-alert>
    <el-row>
        <el-col :span="24">
            <!--
            基本信息
            商品参数
            商品属性
            商品图片
            商品内容
           -->
            <!-- el-steps的active期望是数值  -->
            <el-steps class="steps" align-center :space="200" :active="active*1" finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
            </el-steps>
        </el-col>
    </el-row>

    <el-form class="form" :model="form">
        <el-tabs v-model="active" tab-position="left" @tab-click="tabChange()">
            <el-tab-pane name="1" label="基本信息">
                <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    <!-- 级联选择器 -->
                    <br>
                    <el-cascader expand-trigger="hover" clearable :props="defaultProp" :options="catlist"
                    v-model="selectedOptions" @change="handleChange">
                    </el-cascader>
                </el-form-item>

            </el-tab-pane>
            <el-tab-pane name="2" label="商品参数">
                <el-form-item :label="item.attr_name" v-for="item in dyParams" :key="item.attr_id"> <br>
                    <el-checkbox-group v-model="item.attr_vals">
                        <el-checkbox v-for="(item2,index) in item.attr_vals" border :label="item2" :key="index"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="3" label="商品属性">
                <el-form-item :label="item.attr_name" v-for="item in staticParams" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>

            </el-tab-pane>
            <el-tab-pane name="4" label="商品图片">
                <!-- action
                1. 全路径
                2. 设置授权token
               -->
                <el-upload
                :headers="headers"
                multiple action="http://localhost:8888/api/private/v1/upload" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane name="5" label="商品内容">
                <el-button type="primary"
                @click="addGoods()"
                >添加商品</el-button>
                <!-- 富文本编辑器 -->
                <quill-editor
                class="quill"
                v-model="form.goods_introduce">
                </quill-editor>
            </el-tab-pane>
        </el-tabs>
    </el-form>

</el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: '1',
      // 添加商品的表单数据
      // goods_name	商品名称	不能为空
      // goods_cat	以为','分割的分类列表	不能为空
      // goods_price	价格	不能为空
      // goods_number	数量	不能为空
      // goods_weight	重量	不能为空
      // goods_introduce	介绍	可以为空
      // pics	上传的图片临时路径（对象）	可以为空
      // attrs	商品的参数（数组）	可以为空

      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_introduce: '',
        // 以为','分割的分类列表
        goods_cat: '',
        // 上传的图片临时路径（对象）	{pic:图片的临时路径}
        pics: [],
        // attrs 是商品的动态参数和静态参数
        attrs: []
      },
      // 级联选择器的数据
      catlist: [],
      selectedOptions: [],
      defaultProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 复选框
      checkList: [],
      // 动态参数数据的数组
      dyParams: [],
      // 静态参数数据的数组
      staticParams: [],
      // 图片上传的头部设置
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
    }
  },
  created() {
    this.getGoodsCat()
  },
  methods: {
    // 添加商品
    async addGoods() {
      // this.form.goods_cat
      this.form.goods_cat = this.selectedOptions.join(',')
      // this.form.pics [{pic:路径}]

      console.log(this.dyParams)
      // console.log(this.staticParams)
      /*
          把动态参数数组this.dyParams和静态参数数组this.staticParam
          中attr_id和attr_vals对应值 ,
          以 {"attr_id":动态参数数组元素.attr_id,"attr_value":"ddd"}形式赋值给this.form.attrs
       */
      // this.form.attrs
      // 动态参数数组
      // 遍历 -> 返回一个新数组
      // map 遍历 + 参数cb中的item是数组每个元素 + 把return的值放在新数组中进行返回
      const arr1 = this.dyParams.map(item => {
        return { attr_id: item.attr_id, attr_vals: item.attr_vals }
      })
      // console.log(arr1)
      const arr2 = this.staticParams.map(item => {
        return { attr_id: item.attr_id, attr_vals: item.attr_vals }
      })
      // console.log(arr2)
      this.form.attrs = [...arr1,...arr2]
      // console.log(this.form.attrs)

      // 静态参数数组
      const res = await this.$http.post(`goods`,this.form)
      console.log(res)
      const {meta:{status,msg}} = res.data
      if (status===201) {
        this.$message.success(msg)
        // 回到列表页
        this.$router.push({path:'/goods'})
      }
    },
    // 图片上传的钩子函数
    handlePreview(file) {
      console.log('handlePreview')
      // console.log(file)
    },
    handleRemove(file) {
      console.log('handleRemove')
      // console.log(file)
      // this.form.pics[?].pic === file.response.data.tmp_path
      // findIndex 找下标
      // 遍历数组 把符合return的条件的元素的下标进行返回
      const Index = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path
      })
      // console.log(Index)
      this.form.pics.splice(Index, 1)
      // console.log(this.form.pics)

      // file.response.data.tmp_path
    },
    handleSuccess(response) {
      console.log('handleSuccess')
      // console.log(response)
      //
      this.form.pics.push({
        pic: response.data.tmp_path
      })
      // console.log(this.form.pics)

      // response.data.tmp_path
    },
    // tab切换时 触发
    async tabChange() {
      // 选中的tab是第二个或者第三个
      if (this.active === '2' || this.active === '3') {
        // 要有三级分类
        if (this.selectedOptions.length !== 3) {
          this.$message.error('请先选择商品三级分类')
          return
        }

        const sel = this.active === '2' ? 'many' : 'only'
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=${sel}`
        )

        if (this.active === '2') {
          // 发送请求-获取动态参数数据
          this.dyParams = res.data.data
          // this.dyParams[?].attr_vals 值类型是字符串 "aa,bb,cc" -> [aa,bb,cc]
          this.dyParams.forEach(item => {
            item.attr_vals =
              item.attr_vals.trim().length === 0
                ? []
                : item.attr_vals.trim().split(',')
          })
        } else {
          // 发送请求 获取静态参数数据
          this.staticParams = res.data.data
          // console.log(this.staticParams)
        }
      }
    },
    // 获取三级分类的数据
    async getGoodsCat() {
      const res = await this.$http.get(`categories?type=3`)
      console.log(res)
      this.catlist = res.data.data
    },
    handleChange() {}
  }
}
</script>

<style>
.box-card {
  height: 100%;
}

.info {
  margin-top: 20px;
}

.steps {
  margin-top: 20px;
}

.el-step__title {
  font-size: 10px;
}

.form {
  height: 450px;
  overflow: auto;
}
.quill {
  /* height: 200px; */
  /*  */
}
.ql-editor {
  min-height: 200px;
}
</style>
