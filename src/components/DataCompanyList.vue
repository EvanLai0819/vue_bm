<template>
    <div>
        <div class="tools">
            <i-select v-model="search.pid" style="width: 150px" placeholder="请选择除尘器">
                <i-option value="">请选择除尘器</i-option>
                <i-option v-for="item in products" :value="item.id" :key="item.id">{{item.product_title}}</i-option>
            </i-select>
            <DatePicker type="daterange" placeholder="选择日期" style="margin-left: 15px;width: 200px"
                        :options="options2" :value="search.time" format="yyyy-MM-dd"
                        @on-change="changeDate"></DatePicker>
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
                options2: {
                    shortcuts: [
                        {
                            text: '当天',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 1);
                                return [start, end];
                            }
                        },
                        {
                            text: '当周',
                            value() {
                                const date = new Date();
                                const today = date.getDay();
                                var stepSunDay = -today + 1;
                                if (today == 0) {
                                    stepSunDay = -7;
                                }
                                var time = date.getTime();
                                const start = new Date();
                                start.setTime(time + stepSunDay * 24 * 3600 * 1000);
                                return [start, date];
                            }
                        },
                        {
                            text: '当月',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                const day = new Date().getDate();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * (day - 1));
                                return [start, end];
                            }
                        }
                    ]
                }

            }
        },
        methods: {
            getList() {
                this.$jq.get("/bmData/getWarningList", this.search, (ret) => {
                    this.data = ret.result['list'];
                    this.page.total_count = ret.result['count'];
                    this.page.page_size = ret.result['page_size'];
                    console.log(this.page);
                }, 'json')
            },

            getProductList() {
                this.$jq.get("/bmData/getProductList", this.search, (ret) => {
                    this.products = ret.result['list'];
                }, 'json')
            },


            changePage(page) {
                this.search.per_page = page;
                this.getList();
            },

            changeDate(date) {
                this.search.time = date;
            }

        },
        mounted() {
            this.getProductList();
            this.getList();
        }
    }
</script>

<style scoped>

</style>