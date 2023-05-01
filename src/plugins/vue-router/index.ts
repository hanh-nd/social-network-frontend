import localStorageAuthService from '@/common/authStorage';
import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import LoginPage from '@/pages/auth/pages/LoginPage.vue';
import { isEmpty } from 'lodash';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import PublicLayout from '../../layouts/PublicLayout.vue';
import HomePage from '../../pages/home/pages/HomePage.vue';
import NotFoundPage from '../../pages/not-found/pages/NotFoundPage.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/auth',
        component: PublicLayout,
        children: [
            {
                path: '/login',
                name: PageName.LOGIN_PAGE,
                component: LoginPage,
                meta: {
                    public: true,
                },
            },
            {
                path: '/404',
                name: PageName.NOT_FOUND_PAGE,
                component: NotFoundPage,
                meta: {
                    public: true,
                },
            },
        ],
    },
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '/',
                name: PageName.HOME_PAGE,
                component: HomePage,
            },
        ],
    },
    {
        path: '/:catchAll(.*)*',
        redirect: {
            name: PageName.NOT_FOUND_PAGE,
        },
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
    const loginUser = localStorageAuthService.getLoginUser();
    if (to.matched.some((record) => record.meta.public)) {
        next();
    } else {
        if (isEmpty(loginUser)) {
            next({
                name: PageName.LOGIN_PAGE,
            });
        } else {
            next();
        }
    }
});

export default router;
