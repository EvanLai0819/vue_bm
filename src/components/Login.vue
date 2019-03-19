<template>
    <div class="homeBox">

        <div class="login_form">
            <div class="login_title">
                粉尘系统登录信息
            </div>
            <Divider></Divider>

            <div class="input_item">
                <i-input v-model="username" size="large" placeholder="请输入用户名"></i-input>
            </div>

            <div class="input_item">
                <i-input v-model="password" size="large" placeholder="请输入密码" type="password"></i-input>
            </div>

            <div>
                <i-button type="success" @click="submitForm" long>登录</i-button>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                username: '',
                password: ""
            }
        },
        methods: {
            submitForm() {
                if (!this.username) {
                    this.$Notice.error({
                        title: '请填写用户名',
                        desc: ''
                    });
                    return;
                }

                if (!this.password) {
                    $this.$Notice.error({
                        title: '请填写密码',
                        desc: ''
                    });
                    return;
                }

                this.$jq.post("/bmUser/checkLogin", {username: this.username, password: this.password}, (ret) => {
                    if (ret.code == 0) {
                        this.$Notice.success({
                            title: '登录成功',
                            desc: '',
                            duration: 1.5,
                            onClose: () => {
                                this.$root.is_login = true;
                               // this.$root.city = ret.result['user']['name'];
                                this.$parent.getPermission();
                                this.$router.push(ret.result['route']);
                                // location.href = vApp.return_url
                            }
                        });

                    } else {
                        this.$Notice.error({
                            title: '用户名或密码出错',
                            desc: ''
                        });
                    }
                }, 'json')
            }
        }
    }
</script>

<style scoped>
    .homeBox {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 70px;
        background: url("../static/img/bg.png") repeat;

    }
</style>