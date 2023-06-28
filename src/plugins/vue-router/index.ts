import localStorageAuthService from '@/common/authStorage';
import { PageName } from '@/common/constants';
import MainLayout from '@/layouts/MainLayout.vue';
import LoginPage from '@/pages/auth/pages/LoginPage.vue';
import RegisterPage from '@/pages/auth/pages/RegisterPage.vue';
import ChatPage from '@/pages/chat/pages/ChatPage.vue';
import ProfileInfoPage from '@/pages/profile-info/pages/ProfileInfoPage.vue';
import ProfilePage from '@/pages/profile/pages/ProfilePage.vue';
import SearchPage from '@/pages/search/pages/SearchPage.vue';
import WelcomePage from '@/pages/welcome/pages/WelcomePage.vue';
import { isEmpty } from 'lodash';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import AdminLayout from '../../layouts/AdminLayout.vue';
import PublicLayout from '../../layouts/PublicLayout.vue';
import AdminDashboardPage from '../../pages/admin/dashboard/pages/AdminDashboardPage.vue';
import ManagePostPage from '../../pages/admin/posts/pages/ManagePostPage.vue';
import ManageReportPage from '../../pages/admin/reports/pages/ManageReportPage.vue';
import AdminSettingsPage from '../../pages/admin/settings/pages/SettingsPage.vue';
import ManageSurveyPage from '../../pages/admin/surveys/pages/ManageSurveyPage.vue';
import ManageSystemMessagePage from '../../pages/admin/system-messages/pages/ManageSystemMessagePage.vue';
import ManageUserPage from '../../pages/admin/users/pages/ManageUserPage.vue';
import GroupDetailPage from '../../pages/group-detail/pages/GroupDetailPage.vue';
import GroupPendingPostsPage from '../../pages/group-detail/pages/GroupPendingPostsPage.vue';
import JoinGroupRequestPage from '../../pages/group-detail/pages/JoinGroupRequestPage.vue';
import GroupPage from '../../pages/groups/pages/GroupPage.vue';
import HomePage from '../../pages/home/pages/HomePage.vue';
import NotFoundPage from '../../pages/not-found/pages/NotFoundPage.vue';
import NotificationPage from '../../pages/notifications/pages/NotificationPage.vue';
import PostDetailPage from '../../pages/post-detail/pages/PostDetailPage.vue';
import SuggestionPage from '../../pages/suggestion/pages/SuggestionPage.vue';

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
                path: '/register',
                name: PageName.REGISTER_PAGE,
                component: RegisterPage,
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
            {
                path: '/profile',
                name: PageName.PROFILE_INFORMATION_PAGE,
                component: ProfileInfoPage,
            },
            {
                path: '/profile/:id',
                name: PageName.PROFILE_PAGE,
                component: ProfilePage,
            },
            {
                path: '/welcome',
                name: PageName.WELCOME_PAGE,
                component: WelcomePage,
            },
            {
                path: '/search',
                name: PageName.SEARCH_PAGE,
                component: SearchPage,
            },
            {
                path: '/posts/:id',
                name: PageName.POST_DETAIL_PAGE,
                component: PostDetailPage,
            },
            {
                path: '/groups',
                name: PageName.GROUP_PAGE,
                component: GroupPage,
            },
            {
                path: '/groups/:id',
                name: PageName.GROUP_DETAIL_PAGE,
                component: GroupDetailPage,
            },
            {
                path: '/groups/:id/requests',
                name: PageName.JOIN_GROUP_REQUEST_PAGE,
                component: JoinGroupRequestPage,
            },
            {
                path: '/groups/:id/pending-posts',
                name: PageName.PENDING_GROUP_POSTS_PAGE,
                component: GroupPendingPostsPage,
            },
            {
                path: '/chats/:id',
                name: PageName.CHAT_PAGE,
                component: ChatPage,
            },
            {
                path: '/chats',
                name: PageName.EMPTY_CHAT_PAGE,
                component: ChatPage,
            },
            {
                path: '/notifications',
                name: PageName.NOTIFICATION_PAGE,
                component: NotificationPage,
            },
            {
                path: '/suggestions',
                name: PageName.SUGGESTION_PAGE,
                component: SuggestionPage,
            },
        ],
    },
    {
        path: '/admin',
        component: AdminLayout,
        children: [
            {
                path: '/admin/posts',
                name: PageName.MANAGE_POST_PAGE,
                component: ManagePostPage,
                meta: {
                    admin: true,
                },
            },
            {
                path: '/admin/reports',
                name: PageName.MANAGE_REPORT_PAGE,
                component: ManageReportPage,
                meta: {
                    admin: true,
                },
            },
            {
                path: '/admin/users',
                name: PageName.MANAGE_USER_PAGE,
                component: ManageUserPage,
                meta: {
                    admin: true,
                },
            },
            {
                path: '/admin/dashboard',
                name: PageName.DASHBOARD,
                component: AdminDashboardPage,
                meta: {
                    admin: true,
                },
            },
            {
                path: '/admin/settings',
                name: PageName.SETTINGS_PAGE,
                component: AdminSettingsPage,
                meta: {
                    admin: true,
                },
            },
            {
                path: '/admin/surveys',
                name: PageName.MANAGE_SURVEY_PAGE,
                component: ManageSurveyPage,
                meta: {
                    admin: true,
                },
            },
            {
                path: '/admin/system-messages',
                name: PageName.MANAGE_SYSTEM_MESSAGE_PAGE,
                component: ManageSystemMessagePage,
                meta: {
                    admin: true,
                },
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

router.beforeEach(async (to, from, next) => {
    let isRefreshing = localStorageAuthService.getIsRefreshing();
    while (isRefreshing) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        isRefreshing = localStorageAuthService.getIsRefreshing();
    }
    const loginUser = localStorageAuthService.getLoginUser();
    if (to.matched.some((record) => record.meta.public)) {
        next();
    } else {
        if (isEmpty(loginUser)) {
            if (from.name === PageName.REGISTER_PAGE) {
                next({
                    name: PageName.REGISTER_PAGE,
                });
            } else {
                next({
                    name: PageName.LOGIN_PAGE,
                });
            }
        } else {
            if (to.matched.some((record) => record.meta.admin)) {
                const adminRoleIds = localStorageAuthService.getAdminRoleIds()?.split(',') || [];
                if (adminRoleIds.includes(loginUser.roleId)) {
                    next();
                } else {
                    if (from.name === PageName.REGISTER_PAGE) {
                        next({
                            name: PageName.REGISTER_PAGE,
                        });
                    } else {
                        next({
                            name: PageName.LOGIN_PAGE,
                        });
                    }
                }
            } else {
                next();
            }
        }
    }
});

export default router;
