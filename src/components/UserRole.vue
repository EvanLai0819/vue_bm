<template>
    <div>
        <div class="tools">
            <Input v-model="role_title" placeholder="角色名称" style="width: 150px"/>
            <Button type="primary" icon="ios-search" @click="getRole" style="margin-left: 5px">搜索</Button>
            <Button type="success" to="/UserRoleEdit/edit/0" style="margin-left: 5px">新建</Button>
        </div>
        <i-table :columns="columns" :data="data"></i-table>
    </div>
</template>

<script>
    export default {
        name: "userRole",
        data() {
            return {
                columns: [
                    {
                        title: '编号',
                        key: 'id'
                    },
                    {
                        title: '角色名称',
                        key: 'role_title'
                    },
                    {
                        title: '角色描述',
                        key: 'role_desc'
                    },
                    {
                        title: '包含员工',
                        key: 'role_count'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
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
                                        this.$router.push("/UserRoleEdit/edit/" + params.row.id);
                                    }
                                }
                            }, '编辑'));
                            if (params.row.id != 1) {
                                btn.push(
                                    h('Button', {
                                        props: {
                                            type: 'error',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.delInfo(params.row.id);
                                            }
                                        }
                                    }, '删除')
                                )
                            }
                            return h('div', btn);
                        }
                    }
                ],
                data: [],
                role_title: '',
                info_modal: false
            }
        },
        methods: {
            getRole() {
                this.$jq.get("/permission/getRoleList", {role_title: this.role_title}, (ret) => {
                    this.data = ret.result['list'];
                }, 'json')
            },
            delInfo(id) {
                this.$jq.post("/permission/delRole", {id: id}, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.$Notice.success({
                            title: "删除成功",
                            desc: ''
                        });
                        this.$router.push("/userRole/getRoleList")
                    }
                })
            }

        },
        mounted() {
            this.getRole();
        }
    }
</script>

<style scoped>

</style>