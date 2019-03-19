<template>
    <div>
        <div class="tools">
            <i-select v-model="search.pid" style="width: 150px" placeholder="请选择除尘器">
                <i-option v-for="item in products" :value="item.id" :key="item.id">{{item.product_title}}</i-option>
            </i-select>
            <DatePicker type="daterange" placeholder="选择日期" style="margin-left: 15px;width: 200px"
                        :options="options2" :value="search.time" format="yyyy-MM-dd"
                        @on-change="changeDate"></DatePicker>
            <Button type="success" @click="getCharts" style="margin-left: 5px">查看</Button>
        </div>

        <div ref="myChart" :style="{width: '99%', height: '300px'}"></div>
    </div>
</template>

<script>
    export default {
        name: "DataCompanyList",
        data() {
            return {
                search: {},
                products: [],
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
            getProductList() {
                this.$jq.get("/bmData/getProductList", [], (ret) => {
                    this.products = ret.result['list'];
                }, 'json')
            },

            getCharts() {
                this.$jq.post("/bmData/getCharts", this.search, (ret) => {
                    this.drawLine(ret.result['legend_data'], ret.result['xAxis_data'], ret.result['series']);
                }, 'json')
            },

            drawLine(legend_data, xAxis_data, series) {
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(this.$refs.myChart)
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legend_data
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxis_data
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: series
                }, true);
            },
            changeDate(date) {
                this.search.time = date;
            }
        },
        mounted() {
            this.getProductList();
            this.drawLine();
        }
    }
</script>

<style scoped>

</style>