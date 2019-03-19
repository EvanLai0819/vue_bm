<template>
    <div>
        <div class="tools">
            <Select v-model="search.machine_type" style="width:100px" placeholder="请选择类型">
                <Option :value="-1" key="0">请选择类型</Option>
                <Option :value="0" key="0">干式</Option>
                <Option :value="1" key="1">湿式</Option>
            </Select>
            <Select v-model="search.district" style="width:100px;margin-left: 5px" placeholder="请选择区域"
                    v-if="this.$parent.user_type==1">
                <Option :value="0" key="0">请选择区域</Option>
                <Option v-for="district in districts" :value="district.id">{{district.name}}</Option>
            </Select>
            <Input v-model="search.product_title" placeholder="除尘器名称" style="width: 150px;margin-left:10px"/>
            <Input v-model="search.company_name" placeholder="企业名称" style="width: 150px;margin-left:10px"
                   v-if="this.$parent.user_type!=3"/>
            <Button type="primary" icon="ios-search" @click="getList" style="margin-left: 5px">搜索</Button>
            <Button type="success" @click="showModal()" style="margin-left: 5px" v-if="show_add">新建</Button>
        </div>
        <i-table :columns="columns" :data="data"></i-table>
        <div class="page">
            <Page :total="page.total_count" :page-size="page.page_size" show-elevator @on-change="changePage"/>
        </div>

        <Modal v-model="info_modal" :title="modal_title" :styles="{top: '20px'}">
            <i-form ref="user_info" :model="user_info" :rules="ruleValidate" :label-width="150">
                <FormItem label="除尘器名称" prop="product_title">
                    <Input v-model="user_info.product_title" placeholder=""></Input>
                </FormItem>


                <FormItem label="除尘器标识" prop="product_sign" v-if="show_sign==true">
                    <Input v-model="user_info.product_sign" placeholder=""></Input>
                </FormItem>

                <FormItem label="除尘器类型" prop="machine_type" v-if="is_new">
                    <Select v-model="user_info.machine_type" style="width:100px">
                        <Option :value="0" key="0">干式</Option>
                        <Option :value="1" key="1">湿式</Option>
                    </Select>
                </FormItem>

                <FormItem label="除尘器位置" prop="product_sign">
                    <Input v-model="user_info.product_position" placeholder=""></Input>
                </FormItem>

                <FormItem label="灰斗温度值警告值" prop="ash_temp_warning" v-if="user_info.machine_type==0 && !is_new">
                    <Input v-model="user_info.ash_temp_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="压力值警告值" prop="pressure_warning" v-if="user_info.machine_type==0 && !is_new">
                    <Input v-model="user_info.pressure_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="出口温度值警告值" prop="export_temp_warning" v-if="user_info.machine_type==0 && !is_new">
                    <Input v-model="user_info.export_temp_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="入口温度值警告值" prop="entry_temp_warning" v-if="user_info.machine_type==0 && !is_new">
                    <Input v-model="user_info.entry_temp_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="压差值上限警告值" prop="diff_pressure_up_warning" v-if="user_info.machine_type==0 && !is_new">
                    <Input v-model="user_info.diff_pressure_up_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="压差值下限警告值" prop="diff_pressure_down_warning"
                          v-if="user_info.machine_type==0 && !is_new">
                    <Input v-model="user_info.diff_pressure_down_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="风速值警告值" prop="wind_speed_warning" v-if="user_info.machine_type==0 && !is_new">
                    <Input v-model="user_info.wind_speed_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="液位下限警告值" prop="level_warning" v-if="user_info.machine_type==1 && !is_new">
                    <Input v-model="user_info.level_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="流量下限警告值" prop="flow_warning" v-if="user_info.machine_type==1 && !is_new">
                    <Input v-model="user_info.flow_warning" placeholder="" number></Input>
                </FormItem>

                <FormItem label="氢气浓度值上限警告值" prop="hyConValue_warning" v-if="user_info.machine_type==1 && !is_new">
                    <Input v-model="user_info.hyConValue_warning" placeholder="" number></Input>
                </FormItem>


            </i-form>

            <div slot="footer">
                <Button type="success" @click="ok">保存</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: "Product",
        data() {
            return {
                columns: [
                    {
                        title: '企业名称',
                        key: 'company_name',
                        width: 100
                    },
                    {
                        title: '除尘器名称',
                        key: 'product_title',
                        width: 100
                    },
                    {
                        title: '除尘器标识',
                        key: 'product_sign',
                        width: 100
                    },
                    {
                        title: '类型',
                        key: 'machine_type',
                        width: 60,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 0) {
                                str = '干式';
                            } else {
                                str = '湿式';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '灰斗温度值',
                        key: 'ash_temp_warning',
                        width: 90,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 0) {
                                str = params.row.ash_temp_warning + "°C";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '压力值',
                        key: 'pressure_warning',
                        width: 70,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 0) {
                                str = params.row.pressure_warning + "Mpa";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '出口温度值',
                        key: 'export_temp_warning',
                        width: 90,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 0) {
                                str = params.row.export_temp_warning + "°C";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '入口温度值',
                        key: 'entry_temp_warning',
                        width: 90,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 0) {
                                str = params.row.entry_temp_warning + "°C";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '压差值上限',
                        key: 'diff_pressure_up_warning',
                        width: 100,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 0) {
                                str = params.row.diff_pressure_up_warning + "Pa";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '压差值下限',
                        key: 'diff_pressure_down_warning',
                        width: 100,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 0) {
                                str = params.row.diff_pressure_down_warning + "Pa";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '风速值',
                        key: 'wind_speed_warning',
                        width: 70,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 0) {
                                str = params.row.wind_speed_warning + "m/s";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '液位下限',
                        key: 'level_warning',
                        width: 100,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 1) {
                                str =params.row.level_warning + "m";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '流量下限',
                        key: 'flow_warning',
                        width: 80,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 1) {
                                str = params.row.flow_warning + "m³/s";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '氢气浓度值上限',
                        key: 'hyConValue_warning',
                        width: 80,
                        render: (h, params) => {
                            var str = '';
                            if (params.row.machine_type == 1) {
                                str = params.row.hyConValue_warning + "LEL%";
                            } else {
                                str = '-';
                            }
                            return h('div', str)
                        }
                    },
                    {
                        title: '操作',
                        width: 200,
                        render: (h, params) => {
                            var btn = [];
                            btn.push(h('Button', {
                                props: {
                                    type: '',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.$parent.warning_pid = params.row.id;
                                        this.$router.push("/DataCompany/getInfo");
                                    }
                                }
                            }, '查看'));

                            if (this.show_add) {
                                btn.push(h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal_title = '编辑产品';
                                            this.show_sign = false;
                                            this.getInfo(params.row.id);
                                        }
                                    }
                                }, '编辑'));

                                btn.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$Modal.confirm({
                                                title: '警告',
                                                content: '确定要删除吗？',
                                                onOk: () => {
                                                    this.delInfo(params.row.id);
                                                },
                                                onCancel: () => {

                                                }
                                            });

                                        }
                                    }
                                }, '删除'));
                            }

                            return h('div', btn);


                        }
                    }
                ],
                page: {},
                data: [],
                search: {},
                city: [],
                districts: {},
                user_info: {
                    'product_title': '',
                    'product_sign': '',
                    'ash_temp_warning': 0,
                    'id': 0,
                    'pressure_warning': 0,
                    'export_temp_warning': 0,
                    'entry_temp_warning': 0,
                    'diff_pressure_warning': 0,
                    'wind_speed_warning': 0,
                    'machine_type': 0,
                    'diff_pressure_up_warning': 0,
                    'diff_pressure_down_warning': 0,
                    'level_warning': 0,
                    'flow_warning': 0,
                    'hyConValue_warning': 0,
                    'product_position': ''
                },
                info_modal: false,
                ruleValidate:
                    {
                        product_title: [
                            {required: true, message: '请填写除尘器名称', trigger: 'blur'}
                        ],
                        product_sign:
                            [
                                {required: true, message: '请填写除尘器标识', trigger: 'blur'}
                            ],
                        hyConValue_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        flow_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        level_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        wind_speed_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        diff_pressure_down_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        diff_pressure_up_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        ash_temp_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        pressure_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        export_temp_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                        entry_temp_warning:
                            [
                                {
                                    required: true,
                                    message: '警告值只能是数字且不能为空',
                                    trigger: 'blur',
                                    type: 'number'
                                }
                            ],
                    },
                show_sign: true,
                show_add: false,
                modal_title: '新增产品',
                is_new: false,
            }
        },
        methods: {
            getList() {
                this.$jq.get("/bmProduct/getList", this.search, (ret) => {
                    this.data = ret.result['list'];
                    this.city = ret.result['city'];
                    this.page.total_count = ret.result['count'];
                    this.page.page_size = ret.result['page_size'];
                    console.log(ret.result['user']['user_type']);
                    if (ret.result['user']['user_type'] == 3) {
                        this.show_add = true;
                    }
                }, 'json')
            },

            changePage(page) {
                this.search.per_page = page;
                this.getList();
            },

            getDistrict() {
                this.$jq.get("/bmUser/getDistrict", {}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.districts = ret.result;
                    }
                }, 'json')
            },

            ok() {
                this.$refs['user_info'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }

                    this.$Modal.confirm({
                        title: '提示信息',
                        content: '<p>除尘器标识确定跟场内设备保持一致了吗？</p>',
                        onOk: () => {
                            this.$jq.post("/bmProduct/productSave", this.user_info, (ret) => {
                                if (this.$root.checkCode(ret)) {
                                    this.$Notice.success({
                                        title: '编辑成功',
                                        desc: ''
                                    });
                                    this.info_modal = false;
                                    this.getList();
                                }
                            }, 'json')
                        },
                        onCancel: () => {

                        }
                    });


                })


            },
            getInfo(id) {
                this.show_password = true;
                this.$jq.get("/bmProduct/getInfo", {id: id}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.user_info = ret.result['info'];
                        this.info_modal = true;
                        this.is_new = false;
                    }
                }, 'json')
            },
            delInfo(id) {
                this.$jq.get("/bmProduct/delInfo", {id: id}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.user_info = ret.result['info'];
                        this.info_modal = true;
                        this.is_new = false;
                    }
                }, 'json')
            },
            showModal() {
                this.user_info = {
                    'product_title': '',
                    'product_sign': '',
                    'ash_temp_warning': 0,
                    'id': 0,
                    'pressure_warning': 0,
                    'export_temp_warning': 0,
                    'entry_temp_warning': 0,
                    'diff_pressure_warning': 0,
                    'wind_speed_warning': 0,
                    'machine_type': 0,
                    'diff_pressure_up_warning': 0,
                    'diff_pressure_down_warning': 0,
                    'level_warning': 0,
                    'flow_warning': 0,
                    'hyConValue_warning': 0,
                    'product_position': ''
                };
                this.modal_title = '新建产品';
                this.show_sign = true;
                this.info_modal = true;
                this.is_new = true;
            },
        },
        mounted() {
            this.getList();
            this.getDistrict();
        }
    }
</script>

<style scoped>

</style>