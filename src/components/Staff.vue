<template>
    <div>
        <div class="tools">
            <Input v-model="search.realname" placeholder="真实姓名" style="width: 150px"/>
            <Button type="primary" icon="ios-search" @click="getList" style="margin-left: 5px">搜索</Button>
            <Button type="success" @click="showModal()" style="margin-left: 5px">新建</Button>
        </div>
        <i-table :columns="columns" :data="data"></i-table>
        <div class="page">
            <Page :total="page.total_count" :page-size="page.page_size" show-elevator @on-change="changePage"/>
        </div>

        <Modal v-model="info_modal" :title="modal_title" :styles="{top: '20px'}" @on-cancel="cancel">
            <i-form ref="user_info" :model="user_info" :rules="ruleValidate" :label-width="80">
                <FormItem label="用户姓名" prop="realname">
                    <Input v-model="user_info.realname" placeholder=""></Input>
                </FormItem>


                <FormItem label="登录账号" prop="username">
                    <Input v-model="user_info.username" placeholder=""></Input>
                </FormItem>

                <FormItem label="选择级别" prop="username">
                    <RadioGroup v-model="user_info.user_type">
                        <Radio :label="1">本级用户</Radio>
                        <Radio :label="2">下级用户</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="选择城市" prop="city_code" v-if="user_info.user_type==2">
                    <i-select v-model="user_info.city_code">
                        <i-option value="0">请选择城市</i-option>
                        <i-option v-for="item in city" :value="item.id" :key="item.id">{{item.name}}</i-option>
                    </i-select>
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
    export default {
        name: "Staff",
        data() {
            return {
                columns: [
                    {
                        title: '姓名',
                        key: 'realname',
                        width: 100,
                    },
                    {
                        title: '登录账号',
                        key: 'username'
                    },
                    {
                        title: '区域',
                        key: 'district_name'
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
                                        this.modal_title = '编辑用户';
                                        this.getInfo(params.row.id);
                                    }
                                }
                            }, '编辑'));
                            if (params.row.id > 1) {
                                btn.push(h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.$jq.post("/bmUser/delUser", {id: params.row.id}, (ret) => {
                                                if (this.$root.checkCode(ret)) {
                                                    this.$Notice.success({
                                                        title: '删除成功',
                                                        desc: ''
                                                    });
                                                    this.getList();
                                                }
                                            }, 'json');
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
                user_info: {
                    'realname': '',
                    'username': '',
                    'role_id': 0,
                    'id': 0,
                    'password': '',
                    'user_type': 2
                },
                info_modal: false,
                ruleValidate:
                    {
                        realname: [
                            {required: true, message: '请填写姓名', trigger: 'blur'}
                        ],
                        username:
                            [
                                {required: true, message: '请填写账号', trigger: 'blur'}
                            ],
                        password:
                            [
                                {required: true, message: '请填写密码', trigger: 'blur'}
                            ],
                        city_code:
                            [
                                {required: true, message: '请选择城市', trigger: 'blur'}
                            ],
                    },
                show_password: false,
                modal_title: '新增用户'
            }
        },
        methods: {
            getList() {
                this.$jq.get("/bmUser/getStaffList", this.search, (ret) => {
                    this.data = ret.result['list'];
                    this.city = ret.result['city'];
                    this.page.total_count = ret.result['count'];
                    this.page.page_size = ret.result['page_size'];
                }, 'json')
            },

            changeStatus(params, status) {
                this.$jq.post("/bmUser/changeStatus", {id: params.row.id, status: status}, (ret) => {
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

                    this.$jq.post("/bmUser/userSave", this.user_info, (ret) => {
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

            cancel() {
                this.$refs['user_info'].resetFields()
            },
            getInfo(id) {
                this.show_password = true;
                this.$jq.get("/bmUser/getInfo", {id: id}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.user_info = ret.result['info'];
                        this.info_modal = true;
                    }
                }, 'json')
            },
            showModal() {
                this.user_info = {
                    'realname': '',
                    'mobile': '',
                    'email': '',
                    'username': '',
                    'role_id': 0,
                    'id': 0,
                    'password': '',
                    'user_type': 2
                };
                this.modal_title = '新建用户';
                this.show_password = false;
                this.info_modal = true;
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>

<style scoped>

</style>