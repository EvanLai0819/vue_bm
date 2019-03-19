import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Welcome from '@/components/Welcome'
import UserRole from '@/components/UserRole'
import UserRoleEdit from '@/components/UserRoleEdit'
import Staff from '@/components/Staff'
import Company from '@/components/Company'
import Product from '@/components/Product'
import DataCompanyList from '@/components/DataCompanyList'
import DataCompanyListForDistrict from '@/components/DataCompanyListForDistrict'
import DataCompanyInfo from '@/components/DataCompanyInfo'
import DataCompanyHistoryList from '@/components/DataCompanyHistoryList'
import CheckDataCompanyInfo from '@/components/CheckDataCompanyInfo'
import "@/static/css/new_main.css"
import "@/static/css/iview.css"

Vue.use(Router)


export default new Router({
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: Welcome
        },
        {
            path: '/Login',
            name: 'Login',
            component: Login
        },
        {
            path: '/UserRoleEdit/edit/:id',
            name: 'UserRoleEdit',
            component: UserRoleEdit
        },
        {
            path: '/UserRole/:opt',
            name: 'UserRole',
            component: UserRole
        },
        {
            path: '/Staff/:opt',
            name: 'Staff',
            component: Staff
        },
        {
            path: '/Company/:opt',
            name: 'Company',
            component: Company
        },
        {
            path: '/Product/:opt',
            name: 'Product',
            component: Product
        },
        {
            path: '/DataCompany/getWarningList',
            name: 'DataCompany',
            component: DataCompanyList
        },
        {
            path: '/DataCompany/getWarningListForDistrict',
            name: 'DataCompanyForDistrict',
            component: DataCompanyListForDistrict,
            children: [{
                path:':args',
                name: 'DataCompanyForDistrict',
                component: DataCompanyListForDistrict,
            }]
        },
        {
            path: '/DataCompany/getInfo',
            name: 'DataCompanyInfo',
            component: DataCompanyInfo
        },
        {
            path: '/DataCompany/getHistoryList',
            name: 'DataCompanyHistoryList',
            component: DataCompanyHistoryList
        },
        {
            path: '/DataCompany/getCompanyDataInfo',
            name: 'CheckDataCompanyInfo',
            component: CheckDataCompanyInfo
        },
    ]
})
