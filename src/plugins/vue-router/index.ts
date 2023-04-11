import localStorageAuthService from '@/common/authStorage';
import { PageName } from '@/common/constants';
import { isEmpty } from 'lodash';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MainLayout from '../../layouts/MainLayout.vue';
import HomePage from '../../pages/home/pages/HomePage.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '/',
                name: PageName.HOME_PAGE,
                component: HomePage,
            },
            {
                path: '/404',
                name: PageName.NOT_FOUND_PAGE,
                component: HomePage,
            },
            {
                path: '/:catchAll(.*)*',
                redirect: '/404',
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
});

router.beforeEach((to, from, next) => {
    const loginCustomer = localStorageAuthService.getLoginCustomer();
    if (to.matched.some((record) => record.meta.requiredAuth)) {
        if (isEmpty(loginCustomer)) {
            // authModule.setIsShowLoginDialog(true);
            next(from);
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
