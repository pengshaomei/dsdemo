<template>
<el-card class="box-card">
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert class="alert" title="只允许为第三级分类设置参数" type="error">
    </el-alert>
    <el-form class="form" :model="form">
        <el-form-item label="商品名称">
            <el-cascader expand-trigger="hover" clearable :show-all-levels="false" :props="defaultProp" :options="catlist" v-model="selectedOptions" @change="handleChange">
            </el-cascader>

        </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="1">
            <el-row>
                <el-col :span="24">
                    <el-button type="danger">设置动态参数</el-button>
                </el-col>
            </el-row>
            <el-table :data="list" style="width: 100%">
                <el-table-column type="expand" label="#" width="80">
                    <template slot-scope="scope">
                        <el-tag></el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="属性名称" width="180">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="2">
            <el-row>
                <el-col :span="24">
                    <el-button type="danger">设置静态参数</el-button>
                </el-col>
            </el-row>

               <el-table :data="list" style="width: 100%">
                <el-table-column type="index" label="#" width="80">

                </el-table-column>
                <el-table-column prop="name" label="属性名称" width="180">
                </el-table-column>
                  <el-table-column prop="attrval" label="属性值" width="180">
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            form: {

            },
            // 级联选择器的数据
            catlist: [],
            selectedOptions: [],
            defaultProp: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            activeName: '1',
            list: [{
                name: '',
                attrval:''
            }]
        }
    },
    created() {
        this.getGoodsCat()
    },
    methods: {
        handleClick() {

        },
        handleChange() {},
        // 获取三级分类的数据
        async getGoodsCat() {
            const res = await this.$http.get(`categories?type=3`)
            console.log(res)
            this.catlist = res.data.data
        },

    }
}
</script>

<style>
.alert {
    margin-top: 20px;
}

.form {
    height: 50px;
    margin-top: 20px;

}
</style>
