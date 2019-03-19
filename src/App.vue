<template>
    <div id="app">


        <div class="header_line">
            <div class="header_img"><img src="@/static/img/home.png"></div>
            <div class="header_title">
                <router-link :to="{path:'/'}" style="color: #333;">
                    {{city}}粉尘防爆监控系统
                </router-link>
            </div>

            <div class="login_out" v-if="$route.name != 'Login' ">
                <Button type="info" @click="changePwd()" style="margin-right: 5px">修改密码</Button>
                <Button @click="loginout()">退出</Button>
            </div>
        </div>

        <router-view v-if="$route.name === 'Login' || $route.name === 'Login_redirect'">
        </router-view>
        <template v-else>

            <div class="content">
                <router-view>
                </router-view>
            </div>

            <div class="menu">
                <Menu theme="light" width="auto" ref="layoutMenu" :active-name="active_name"
                      :open-names="open_name">
                    <Submenu :name="permission.router" v-for="permission in permission_list" :key="permission.id">
                        <template slot="title">
                            <Icon type="ios-paper"/>
                            {{permission.node_title}}
                        </template>

                        <MenuItem :name="sub.action" v-for="sub in permission.sub" :key="sub.id"
                                  :to="'/'+permission.router+'/'+sub.action">
                            {{sub.node_title}}
                        </MenuItem>
                    </Submenu>
                </Menu>
            </div>
        </template>

        <Modal v-model="pwd_modal" title="修改密码" :styles="{top: '20px'}">
            <i-form ref="info" :model="info" :rules="ruleValidate" :label-width="100">

                <FormItem label="原密码" prop="ori_password">
                    <Input type="password" v-model="info.ori_password" placeholder=""></Input>
                </FormItem>

                <FormItem label="新密码" prop="password">
                    <Input type="password" v-model="info.password" placeholder=""></Input>
                </FormItem>

                <FormItem label="确认新密码" prop="repeat_password">
                    <Input type="password" v-model="info.repeat_password" placeholder=""></Input>
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
        components: {},
        name: 'App',
        data() {
            return {
                permission_list: '',
                active_name: '',
                open_name: [],
                info: {
                    'ori_password': '',
                    'password': '',
                    'repeat_password': '',
                },
                warning_pid: 0,
                city: '',
                pwd_modal: false,
                user_type: 0,
                ruleValidate:
                    {
                        ori_password: [
                            {required: true, message: '请填写原始密码', trigger: 'blur'}
                        ],
                        password:
                            [
                                {required: true, message: '请填写密码', trigger: 'blur'}
                            ],
                        repeat_password:
                            [
                                {required: true, message: '请确认密码', trigger: 'blur'}
                            ],
                    },
            }
        },
        methods: {
            getPermission() {
                this.$jq.post("/bmUser/getPermission", {}, (ret) => {
                    if (ret.code == 1002) {
                        this.$router.push('/Login');
                    } else {
                        this.permission_list = ret.result['permission_list'];
                        this.city = ret.result['user']['name'];
                        this.user_type = ret.result['user']['user_type'];
                        this.$nextTick(() => {
                            if (this.$refs.layoutMenu) {
                                this.$refs.layoutMenu.updateActiveName()
                                this.$refs.layoutMenu.updateOpened()
                            }
                        })
                        this.$router.push(this.$route.path);
                    }
                }, 'json')
            },
            loginout() {
                this.$jq.get("/bmUser/loginout", {}, () => {
                    this.$Notice.success({
                        title: "退出成功",
                        desc: ''
                    });
                    this.city = "";
                    this.$router.push('/Login');
                }, 'json')
            },
            getUrl() {
                var arr = this.$route.path.split("/");
                this.open_name.push(arr[1]);
                this.active_name = arr[2];
            },
            ok() {
                this.$refs['info'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }

                    this.$jq.post("/bmUser/savePwd", this.info, (ret) => {
                        if (this.$root.checkCode(ret)) {
                            this.$Notice.success({
                                title: '修改成功',
                                desc: ''
                            });
                            this.pwd_modal = false;
                        }
                    }, 'json')
                })
            },
            changePwd() {
                this.pwd_modal = true;
                this.info = {
                    'ori_password': '',
                    'password': '',
                    'repeat_password': '',
                }
            }
        },
        mounted() {
            this.getUrl();
            this.getPermission();
        },
        watch: {
            $route() {
                this.getUrl();
            }
        }
    }
</script>


