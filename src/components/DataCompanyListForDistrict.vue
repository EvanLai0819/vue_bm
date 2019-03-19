<template>
    <div>
        <div class="tools">
            <i-select v-model="search.company" style="width: 150px" placeholder="请选择企业" @on-change="getProductList">
                <i-option value="">请选择企业</i-option>
                <i-option v-for="item in companys" :value="item.id" :key="item.id">{{item.company_name}}</i-option>
            </i-select>
            <i-select v-model="search.pid" style="width: 150px;margin-left: 5px" placeholder="请选择除尘器">
                <i-option value="">请选择除尘器</i-option>
                <i-option v-for="item in products" :value="item.id" :key="item.id">{{item.product_title}}</i-option>
            </i-select>
            <DatePicker type="date" placeholder="选择告警开始日期" style="width: 150px;margin-left: 5px" format="yyyy-MM-dd"
                        v-model="search.begin_time" @on-change="search.begin_time=$event"></DatePicker>
            -
            <DatePicker type="date" placeholder="选择告警结束日期" style="width: 150px" format="yyyy-MM-dd"
                        v-model="search.end_time" @on-change="search.end_time=$event"></DatePicker>
            <Button type="primary" icon="ios-search" @click="getList" style="margin-left: 5px">搜索</Button>
        </div>
        <i-table :columns="columns" :data="data"></i-table>
        <div class="page">
            <Page :total="page.total_count" :page-size="page.page_size" show-elevator @on-change="changePage"/>
        </div>

    </div>
</template>

<script>
    export default {
        name: "DataCompanyList",
        data() {
            return {
                columns: [
                    {
                        title: '企业名称',
                        key: 'company_name',
                    },
                    {
                        title: '除尘器名称',
                        key: 'product_title',
                    },
                    {
                        title: '告警类型',
                        key: 'warning_data_name'
                    },
                    {
                        title: '收集值',
                        key: 'current_value'
                    },
                    {
                        title: '告警值',
                        key: 'warn_value'
                    },
                    {
                        title: '告警时间',
                        key: 'create_time'
                    }
                ],
                page: {},
                data: [],
                products: [],
                search: {},
                companys: []
            }
        },
        methods: {
            getCompany() {
                this.$jq.get("/bmCompany/getList", this.search, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.companys = ret.result['list'];
                    }
                }, 'json')
            },

            getList() {
                this.$jq.get("/bmData/getWarningListForDistrict", this.search, (ret) => {
                    this.data = ret.result['list'];
                    this.search.begin_time = ret.result['search'].begin_time;
                    this.search.end_time = ret.result['search'].end_time;
                    this.page.total_count = ret.result['count'];
                    this.page.page_size = ret.result['page_size'];
                }, 'json')
            },

            getProductList(company) {
                this.$jq.get("/bmData/getProductList", {company: company}, (ret) => {
                    this.search.pid = "";
                    this.products = ret.result['list'];
                }, 'json')
            },


            changePage(page) {
                this.search.per_page = page;
                this.getList();
            },

        },
        mounted() {
            this.getCompany();
            this.getList();
        }
    }
</script>

<style scoped>

</style>