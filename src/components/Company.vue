<template>
    <div>
        <div class="tools">
            <Input v-model="search.company_name" placeholder="企业名称" style="width: 150px"/>
            <Select v-model="search.district" style="width:100px;margin-left: 5px" placeholder="请选择区域"
                    v-if="this.$parent.user_type==1">
                <Option :value="0" key="0">请选择区域</Option>
                <Option v-for="district in districts" :value="district.id">{{district.name}}</Option>
            </Select>
            <Button type="primary" icon="ios-search" @click="getList" style="margin-left: 5px">搜索</Button>
            <Button type="success" @click="showModal()" style="margin-left: 5px" v-if="show_create">新建</Button>
        </div>
        <i-table :columns="columns" :data="data"></i-table>
        <div class="page">
            <Page :total="page.total_count" :page-size="page.page_size" show-elevator @on-change="changePage"/>
        </div>

        <Modal v-model="info_modal" :title="modal_title" :styles="{top: '20px'}">
            <i-form ref="user_info" :model="user_info" :rules="ruleValidate" :label-width="80">
                <FormItem label="企业名称" prop="company_name">
                    <Input v-model="user_info.company_name" placeholder=""></Input>
                </FormItem>


                <FormItem label="登录账号" prop="username">
                    <Input v-model="user_info.username" placeholder=""></Input>
                </FormItem>

                <FormItem label="登录密码" prop="password">
                    <Input type="password" v-model="user_info.password" placeholder=""></Input>
                </FormItem>


            </i-form>

            <div slot="footer">
                <Button type="success" @click="ok">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Operation from "iview/src/components/transfer/operation";

    export default {
        name: "Staff",
        components: {Operation},
        data() {
            return {
                columns: [
                    {
                        title: '企业',
                        key: 'company_name',
                        width: 200,
                    },
                    {
                        title: '登录账号',
                        key: 'username'
                    },
                    {
                        title: '创建时间',
                        key: 'create_time'
                    },
                    {
                        title: '操作',
                        width: 300,
                        render: (h, params) => {
                            var btn = [];
                            if (this.show_create) {
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
                                            this.modal_title = '编辑企业';
                                            this.getInfo(params.row.id);
                                        }
                                    }
                                }, '编辑'));
                            }

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
                    'realname': '',
                    'username': '',
                    'role_id': 0,
                    'id': 0,
                    'password': ''
                },
                info_modal: false,
                ruleValidate:
                    {
                        company_name: [
                            {required: true, message: '请填写企业名称', trigger: 'blur'}
                        ],
                        username:
                            [
                                {required: true, message: '请填写账号', trigger: 'blur'}
                            ],
                        password:
                            [
                                {required: true, message: '请填写密码', trigger: 'blur'}
                            ]
                    },
                show_password: false,
                modal_title: '新增企业',
                show_create: false
            }
        },
        methods: {
            getList() {
                this.$jq.get("/bmCompany/getCompanyList", this.search, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.data = ret.result['list'];
                        this.city = ret.result['city'];
                        this.page.total_count = ret.result['count'];
                        this.page.page_size = ret.result['page_size'];
                        this.show_create = ret.result['show_create'];
                    }
                }, 'json')
            },

            changeStatus(params, status) {
                this.$jq.post("/bmCompany/changeStatus", {id: params.row.id, status: status}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.$Notice.success({
                            title: '修改成功',
                            desc: ''
                        });
                        params.row.user_status = status;
                    }
                }, 'json')
            },

            changePage(page) {
                this.search.per_page = page;
                this.getList();
            },

            ok() {
                this.$refs['user_info'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }

                    this.$jq.post("/bmCompany/userSave", this.user_info, (ret) => {
                        if (this.$root.checkCode(ret)) {
                            this.$Notice.success({
                                title: '编辑成功',
                                desc: ''
                            });
                            this.info_modal = false;
                            this.getList();
                        }
                    }, 'json')
                })


            },
            getInfo(id) {
                this.show_password = true;
                this.$jq.get("/bmCompany/getInfo", {id: id}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.user_info = ret.result['info'];
                        this.info_modal = true;
                    }
                }, 'json')
            },
            delInfo(id) {
                this.$jq.get("/bmCompany/delInfo", {id: id}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                       this.getList();
                    }
                }, 'json')
            },
            getDistrict() {
                this.$jq.get("/bmUser/getDistrict", {}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.districts = ret.result;
                    }
                }, 'json')
            },
            showModal() {
                this.user_info = {
                    'realname': '',
                    'username': '',
                    'role_id': 0,
                    'id': 0,
                    'password': ''
                };
                this.modal_title = '新建企业';
                this.show_password = false;
                this.info_modal = true;
            }
        },
        mounted() {
            this.getList();
            this.getDistrict();
        }
    }
</script>

<style scoped>

</style>