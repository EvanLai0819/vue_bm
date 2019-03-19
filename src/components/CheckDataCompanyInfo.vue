<template>
    <div>
        <div class="tools">
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
                {{info.company_total_count}}
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
                <router-link :to="{path:'/DataCompany/getWarningListForDistrict'}"
                             style="color: #ff9900">{{info.warning_total_count}}</router-link>
            </span>

            <span class="item_footer">
                次
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CheckDataCompanyInfo",
        data() {
            return {
                city: [],
                search: {},
                info: {
                    company_total_count: 0,
                    warning_total_count: 0
                }
            }
        },
        methods: {
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
            }
        },
        mounted() {
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