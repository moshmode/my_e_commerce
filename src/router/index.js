import router from "vue-router";
import Login from "@/components/Login";
import Home from "@/components/Home";
import Users from "@/view/user/Users";
import Welcome from "@/view/welcome/Welcome";
import RightList from "@/view/right/RightList";
import RoleList from "@/view/right/RoleList";
import GoodList from "@/view/good/GoodList";
import OrderList from "@/view/order/OrderList";

const default_router = new router({

    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/userList',
                    component: Users
                },
                {
                    path: '/rightList',
                    component: RightList
                },
                {
                    path: '/roleList',
                    component: RoleList
                },
                {
                    path: '/goodsList',
                    component: GoodList
                },
                {
                    path: '/ordersList',
                    component: OrderList
                }
            ]
        }
    ]
})

default_router.beforeEach((to, from, next) => {
    //to: will be visited
    // from: where is come from
    //next is a function: indicate release
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default default_router
