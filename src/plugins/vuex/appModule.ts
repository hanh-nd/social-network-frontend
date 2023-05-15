import authStorageService from '@/common/authStorage';
import { DeviceType, MD_GRID_BREAKPOINT } from '@/common/constants';
import { IComment, IPost, IUser } from '@/common/interfaces';
import { default as appApiService } from '@/common/service/app.api.service';
import store from '@/plugins/vuex';
import { isEmpty } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

@Module({
    name: 'app',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AppModule extends VuexModule {
    isShowCreatePostDialog = false;
    isShowPostDetailDialog = false;
    isShowEditPostDialog = false;
    isShowReportPostDialog = false;
    isShowReportCommentDialog = false;
    isShowReactionListDialog = false;
    isShowShareListDialog = false;
    postDetail: IPost = {} as IPost;
    commentDetail: IComment = {} as IComment;
    loginUser: IUser = {} as IUser;
    screenWidth = window.innerWidth;
    isRefreshing = false;
    isShowSharePostDialog = false;
    searchKeyword = '';

    get deviceType() {
        return this.screenWidth <= MD_GRID_BREAKPOINT ? DeviceType.MOBILE : DeviceType.DESKTOP;
    }

    get isMobile() {
        return this.screenWidth <= MD_GRID_BREAKPOINT;
    }

    get isLogin() {
        return !isEmpty(this.loginUser);
    }

    @Action
    setLoginUser(user: IUser) {
        this.SET_LOGIN_USER(user);
    }

    @Action
    async getUserProfile() {
        const response = await appApiService.getUserProfile();
        if (response?.success) {
            this.setLoginUser(response?.data || {});
            authStorageService.setLoginUser(response?.data || {});
        } else {
            this.setLoginUser({} as IUser);
            authStorageService.setLoginUser({} as IUser);
        }
    }

    @Action
    setIsShowCreatePostDialog(isShowCreatePostDialog: boolean) {
        this.SET_IS_SHOW_CREATE_POST_DIALOG(isShowCreatePostDialog);
    }

    @Action
    setScreenWidth(screenWidth: number) {
        this.SET_SCREEN_WIDTH(screenWidth);
    }

    @Mutation
    SET_LOGIN_USER(loginUser: IUser) {
        this.loginUser = loginUser;
    }

    @Mutation
    SET_SCREEN_WIDTH(screenWidth: number) {
        this.screenWidth = screenWidth;
    }

    @Mutation
    SET_IS_SHOW_CREATE_POST_DIALOG(isShowCreatePostDialog: boolean) {
        this.isShowCreatePostDialog = isShowCreatePostDialog;
    }

    @Action
    setIsShowPostDetailDialog(isShowPostDetailDialog: boolean) {
        this.SET_IS_SHOW_POST_DETAIL_DIALOG(isShowPostDetailDialog);
    }

    @Mutation
    SET_IS_SHOW_POST_DETAIL_DIALOG(isShowPostDetailDialog: boolean) {
        this.isShowPostDetailDialog = isShowPostDetailDialog;
    }

    @Action
    setPostDetail(post: IPost) {
        this.SET_POST_DETAIL(post);
    }

    @Mutation
    SET_POST_DETAIL(post: IPost) {
        this.postDetail = post;
    }

    @Action
    setCommentDetail(comment: IComment) {
        this.SET_COMMENT_DETAIL(comment);
    }

    @Mutation
    SET_COMMENT_DETAIL(comment: IComment) {
        this.commentDetail = comment;
    }

    @Action
    setIsShowSharePostDialog(isShowSharePostDialog: boolean) {
        this.SET_IS_SHOW_SHARE_POST_DIALOG(isShowSharePostDialog);
    }

    @Mutation
    SET_IS_SHOW_SHARE_POST_DIALOG(isShowSharePostDialog: boolean) {
        this.isShowSharePostDialog = isShowSharePostDialog;
    }

    @Action
    setIsShowEditPostDialog(isShowEditPostDialog: boolean) {
        this.SET_IS_SHOW_EDIT_POST_DIALOG(isShowEditPostDialog);
    }

    @Mutation
    SET_IS_SHOW_EDIT_POST_DIALOG(isShowEditPostDialog: boolean) {
        this.isShowEditPostDialog = isShowEditPostDialog;
    }

    @Action
    setIsShowReportPostDialog(isShowReportPostDialog: boolean) {
        this.SET_IS_SHOW_REPORT_POST_DIALOG(isShowReportPostDialog);
    }

    @Mutation
    SET_IS_SHOW_REPORT_POST_DIALOG(isShowReportPostDialog: boolean) {
        this.isShowReportPostDialog = isShowReportPostDialog;
    }

    @Action
    setIsShowReportCommentDialog(isShowReportCommentDialog: boolean) {
        this.SET_IS_SHOW_REPORT_COMMENT_DIALOG(isShowReportCommentDialog);
    }

    @Mutation
    SET_IS_SHOW_REPORT_COMMENT_DIALOG(isShowReportCommentDialog: boolean) {
        this.isShowReportCommentDialog = isShowReportCommentDialog;
    }

    @Action
    setSearchKeyword(searchKeyword: string) {
        this.SET_SEARCH_KEYWORD(searchKeyword);
    }

    @Mutation
    SET_SEARCH_KEYWORD(searchKeyword: string) {
        this.searchKeyword = searchKeyword;
    }

    @Action
    setIsShowReactionListDialog(isShowReactionListDialog: boolean) {
        this.SET_IS_SHOW_REACTION_LIST_DIALOG(isShowReactionListDialog);
    }

    @Mutation
    SET_IS_SHOW_REACTION_LIST_DIALOG(isShowReactionListDialog: boolean) {
        this.isShowReactionListDialog = isShowReactionListDialog;
    }

    @Action
    setIsShowShareListDialog(isShowShareListDialog: boolean) {
        this.SET_IS_SHOW_SHARE_LIST_DIALOG(isShowShareListDialog);
    }

    @Mutation
    SET_IS_SHOW_SHARE_LIST_DIALOG(isShowShareListDialog: boolean) {
        this.isShowShareListDialog = isShowShareListDialog;
    }
}

export const appModule = getModule(AppModule);
