<template>
    <div>
        <div class="tools">
            <i-select v-model="search.products" style="width: 150px" placeholder="请选择除尘器" @on-change="changeData">
                <i-option v-for="item in products" :value="item.id" :key="item.id">{{item.product_title}}</i-option>
            </i-select>

            <Button type="success" @click="getInfo()" style="margin-left: 5px">刷新</Button>
        </div>

        <div class="record_data_time">
            上报时间: <span style="padding-left: 10px">{{info.reportTime}}</span>
        </div>

        <div v-if="show_row==0">
            <Row class="record_data_list" :gutter="16">
                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/dust.png" class="data_icon_img">
                        </div>
                        <div class="data_title">灰斗温度值：<span class="data_content">{{info.ashTemp}}</span><span
                                class="data_unit">°C</span></div>
                    </div>
                </Col>
                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/equipment.png" class="data_icon_img">
                        </div>
                        <div class="data_title">设备类型：<span class="data_content">{{info.machineTypeVal}}</span>
                            <span class="data_unit"></span>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row class="record_data_list" :gutter="16">
                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/pressure.png" class="data_icon_img">
                        </div>
                        <div class="data_title">压力：<span class="data_content">{{info.pressure}}</span><span
                                class="data_unit">Mpa</span></div>
                    </div>
                </Col>

                <Col span="12" v-if="show_row==0">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/temperature.png" class="data_icon_img">
                        </div>
                        <div class="data_title">出口温度：<span class="data_content">{{info.exportTemp}}</span><span
                                class="data_unit">°C</span></div>
                    </div>
                </Col>
            </Row>

            <Row class="record_data_list" :gutter="16">
                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/temperature.png" class="data_icon_img">
                        </div>
                        <div class="data_title">入口温度：<span class="data_content">{{info.entryTemp}}</span><span
                                class="data_unit">°C</span></div>
                    </div>
                </Col>

                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/vf.png" class="data_icon_img">
                        </div>
                        <div class="data_title">压差：<span class="data_content">{{info.diffPressure}}</span><span
                                class="data_unit">Pa</span></div>
                    </div>
                </Col>
            </Row>

            <Row class="record_data_list" :gutter="16">
                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/fire.png" class="data_icon_img">
                        </div>
                        <div class="data_title">火花信号：<span class="data_content">{{info.sparkSignal}}</span><span
                                class="data_unit"></span></div>
                    </div>
                </Col>

                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/wind_speed.png" class="data_icon_img">
                        </div>
                        <div class="data_title">风速：<span class="data_content">{{info.windSpeed	}}</span><span
                                class="data_unit">m/s</span>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row class="record_data_list" :gutter="16">
                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/valve.png" class="data_icon_img">
                        </div>
                        <div class="data_title">锁气卸灰阀开关量：<span class="data_content">{{info.lockValue}}</span><span
                                class="data_unit"></span>
                        </div>
                    </div>
                </Col>

                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/fans.png" class="data_icon_img">
                        </div>
                        <div class="data_title">风机：<span class="data_content">{{info.FanRunning}}</span><span
                                class="data_unit"></span>
                        </div>
                    </div>
                </Col>
            </Row>


        </div>

        <div v-if="show_row==1">
            <Row class="record_data_list" :gutter="16">
                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/h2.png" class="data_icon_img">
                        </div>
                        <div class="data_title">氢气浓度：<span class="data_content">{{info.hyConValue}}</span><span
                                class="data_unit">LEL%</span></div>
                    </div>
                </Col>


                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/fire.png" class="data_icon_img">
                        </div>
                        <div class="data_title">火花信号：<span class="data_content">{{info.sparkSignal}}</span><span
                                class="data_unit"></span></div>
                    </div>
                </Col>
            </Row>

            <Row class="record_data_list" :gutter="16">
                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/liquid.png" class="data_icon_img">
                        </div>
                        <div class="data_title">液位：<span class="data_content">{{info.level}}</span><span
                                class="data_unit">m</span></div>
                    </div>
                </Col>

                <Col span="12">
                    <div class="record_data">
                        <div class="data_icon">
                            <img src="@/static/img/flow.png" class="data_icon_img">
                        </div>
                        <div class="data_title">流量：<span class="data_content">{{info.flow}}</span><span
                                class="data_unit">m³/s</span>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>

    </div>
</template>

<script>
    export default {
        name: "DataCompanyInfo",
        data() {
            return {
                products: [],
                search: [],
                info: [],
                pid: 0,
                show_row: -1
            }
        },
        methods: {
            getProductList() {
                this.$jq.get("/bmData/getProductList", {}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.products = ret.result['list'];
                    }
                }, 'json')
            },
            getInfo() {
                this.$jq.post("/bmData/getInfo", {pid: this.$parent.warning_pid}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.info = ret.result['info'];
                        this.show_row = ret.result['info']['machineType'];
                    }
                }, 'json')
            },
            changeData(value) {
                this.$parent.warning_pid = value;
                this.getInfo();
            }
        },
        mounted() {
            this.getProductList();
            if (this.$parent.warning_pid) {
                this.search.products = this.$parent.warning_pid;
                this.getInfo();

            }
        }
    }
</script>

<style scoped>

</style>