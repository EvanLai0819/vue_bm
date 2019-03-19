<template>
    <div>
        <div v-if="$parent.user_type==1 || $parent.user_type==2">
            <div class="tools" v-if="show_district">
                <i-select v-model="search.city_code" style="width: 150px" placeholder="请选择区域">
                    <i-option value="">请选择区域</i-option>
                    <i-option v-for="item in city" :value="item.id" :key="item.id">{{item.name}}</i-option>
                </i-select>
                <Button type="success" @click="getInfo" style="margin-left: 5px">查看</Button>
            </div>

            <div class="item_info">
            <span class="item_title">
                企业数：
            </span>

                <span class="item_main">
                <router-link :to="{path:'/Company/getCompanyList'}">
                     {{info.company_total_count}}
                </router-link>

            </span>

                <span class="item_footer">
                家
            </span>
            </div>

            <div class="item_info">
            <span class="item_title">
                今日告警数：
            </span>

                <span class="item_main">
                <router-link :to="{path:'/DataCompany/getWarningList'}"
                             style="color: #ff9900">{{info.warning_total_count}}</router-link>
            </span>

                <span class="item_footer">
                次
            </span>
            </div>
        </div>

        <div v-if="$parent.user_type==3" v-for="info in this.record_list">
            <div class="w_info_title">
                {{info.product_title}}
            </div>
            <div v-if="info.machineType==0"
                 style="border-bottom: 1px solid #e8eaec;margin-bottom: 10px;margin-top: 10px">
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

                    <Col span="12">
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

            <div v-if="info.machineType==1"
                 style="border-bottom: 1px solid #e8eaec;margin-bottom: 10px;margin-top: 10px">
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
    </div>

</template>

<script>
    export default {
        name: "Welcome",
        data() {
            return {
                city: [],
                search: {},
                info: {
                    company_total_count: 0,
                    warning_total_count: 0
                },
                show_content: false,
                show_district: true,
                record_list: {},
                user_type: 0
            }
        },
        methods: {
            getUserInfo() {
                this.$jq.post("/bmUser/getMyInfo", {}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.$parent.user_type = ret.result['info']['user_type'];
                        if (ret.result['info']['user_type'] == 1 || ret.result['info']['user_type'] == 2) {
                            this.show_content = true;
                            if (ret.result['info']['user_type'] == 2) {
                                this.show_district = false;
                            }

                            this.getInfo();
                        }

                        if (ret.result['info']['user_type'] == 3) {
                            this.getRecordInfo();
                        }
                    }


                }, 'json')
            },

            getDistrict() {
                this.$jq.post("/bmData/getDistrict", {}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.city = ret.result['city'];
                    }
                }, 'json')
            },
            getInfo() {
                this.$jq.post("/bmData/getCompanyDataInfo", this.search, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.info = ret.result;
                    }
                }, 'json')
            },
            getRecordInfo() {
                this.$jq.post("/bmData/getRecordList", this.search, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.record_list = ret.result;
                    }
                }, 'json')
            }
        },
        mounted() {
            this.getUserInfo();
            this.getDistrict();
        }
    }
</script>

<style scoped>
    .item_info {
        margin-bottom: 15px;
        font-size: 18px;
    }

    .item_main {
        display: inline-block;
        color: #2d8cf0;
        margin-right: 5px;
    }

</style>