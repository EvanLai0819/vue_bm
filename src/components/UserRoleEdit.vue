<template>
    <div>
        <div class="info_title">
            {{info_title}}
        </div>

        <Form :model="formItem" :label-width="80">
            <FormItem label="角色名称">
                <Input v-model="formItem.role_title" placeholder="" style="width: 200px"></Input>
            </FormItem>

            <FormItem label="角色描述">
                <Input v-model="formItem.role_desc" placeholder="" style="width: 200px"></Input>
            </FormItem>

            <FormItem label="权限选择">
                <div v-for="(role,i) in this.checkAllGroup">
                    <div>
                        <Checkbox v-model="checkAll[i]" @on-change="changeRole(i)" :indeterminate="indeterminate[i]"
                                  :label="role.id">
                            {{role.node_title}}
                        </Checkbox>
                    </div>

                    <div style="margin-left: 20px;">
                        <CheckboxGroup v-model="node[i]" @on-change="checkAllGroupChange(i)">
                            <Checkbox v-for="children_role in role.sub" :label="children_role.id"
                                      :key="children_role.id">
                                {{children_role.node_title}}
                            </Checkbox>
                        </CheckboxGroup>
                    </div>
                </div>
            </FormItem>

            <FormItem>
                <Button type="primary" @click="submitInfo()">保存</Button>
            </FormItem>
        </Form>

    </div>
</template>

<script>
    export default {
        name: "UserRoleEdit",
        data() {
            return {
                info_title: "",
                id: this.$route.params.id,
                formItem: {},
                indeterminate: [],
                checkAll: [],
                checkAllGroup: [],
                node: []
            }
        },
        mounted() {
            if (this.id > 0) {
                this.info_title = "编辑权限"
            } else {
                this.info_title = "新建权限"
            }
            this.getRole()
        },
        methods: {
            getRole() {
                this.$jq.get("/permission/roleInfo", {id: this.id}, (ret) => {
                    this.checkAllGroup = ret.result['data']['node'];
                    this.node = ret.result['data']['node'].map((item, i) => {
                        var arr = [];
                        this.checkAll[i] = false;
                        this.indeterminate[i] = false;
                        var all_length = 0;
                        if (this.id > 0) {
                            item.sub.forEach((v, k) => {
                                if (ret.result['data']['node_role'].includes(v.id)) {
                                    arr.push(v.id);
                                    all_length++;
                                }
                            })

                            const isSame = this.checkAllGroup[i].sub.length === all_length;
                            this.indeterminate[i] = all_length != 0 && !isSame;
                            this.checkAll[i] = all_length != 0;
                        }
                        return arr;
                    })

                    if (this.id > 0) {
                        this.formItem = ret.result['data']['info'];
                    }

                }, 'json')
            },
            changeRole(i) {
                if (this.checkAll[i]) {
                    this.node[i] = this.checkAllGroup[i].sub.map((item) => {
                        return item.id
                    });
                } else {
                    this.node[i] = [];
                }
                this.indeterminate[i] = false;
            },
            checkAllGroupChange(i) {
                const isSame = this.checkAllGroup[i].sub.length === this.node[i].length;
                this.indeterminate[i] = this.node[i].length != 0 && !isSame;
                this.checkAll[i] = this.node[i].length != 0;
            },
            submitInfo() {
                this.formItem.node = [];

                if (!this.formItem.role_title) {
                    this.$Message.error('角色名称不能为空');
                    return;
                }

                if (!this.formItem.role_desc) {
                    this.$Message.error('角色描述不能为空');
                    return;
                }

                this.checkAll.forEach((v, k) => {
                    if (v) {
                        this.formItem.node.push(this.checkAllGroup[k].id);
                    }
                })

                this.node.forEach((v, k) => {
                    v.forEach((vc, kc) => {
                        if (vc) {
                            this.formItem.node.push(vc);
                        }
                    })
                })


                if (this.formItem.node.length == 0) {
                    this.$Message.error('请选择权限');
                    return;
                }

                this.$jq.post("/permission/saveNodeRole", this.formItem, (ret) => {
                    if (this.$root.checkCode(ret)) {
                        this.$Notice.success({
                            title: "保存成功",
                            desc: '',
                            duration: 1.5,
                            onClose: () => {
                                this.$parent.getPermission();
                                this.$router.push("/UserRole/getRoleList");
                            }
                        });

                    }
                }, 'json');
            }
        }
    }
</script>
