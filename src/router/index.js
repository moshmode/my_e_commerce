import router from "vue-router";
import Login from "@/components/Login";

export default new router({

    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: Login
        }
    ]

})