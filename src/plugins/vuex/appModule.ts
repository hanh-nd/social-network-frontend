import authStorageService from '@/common/authStorage';
import { DeviceType, MD_GRID_BREAKPOINT } from '@/common/constants';
import { IComment, IPost, IRole, ISurvey, ISystemMessage, ITag, IUser } from '@/common/interfaces';
import { default as appApiService } from '@/common/service/app.api.service';
import roleApiService from '@/common/service/role.api.service';
import tagApiService from '@/common/service/tag.api.service';
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
    isShowSystemMessageDialog = false;
    isShowSurveyDialog = false;
    postDetail: IPost = {} as IPost;
    commentDetail: IComment = {} as IComment;
    loginUser: IUser = {} as IUser;
    screenWidth = window.innerWidth;
    isRefreshing = false;
    isShowSharePostDialog = false;
    searchKeyword = '';
    tags: ITag[] = [];
    roles: IRole[] = [];
    systemMessage: ISystemMessage = {} as ISystemMessage;
    systemMessageParameters: object = {};
    survey: ISurvey = {} as ISurvey;

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

    @Action
    async getTags() {
        const response = await tagApiService.getTags();
        if (response?.success) {
            this.SET_TAGS(response?.data || []);
        } else {
            this.SET_TAGS([]);
        }
    }

    @Mutation
    SET_TAGS(tags: ITag[]) {
        this.tags = tags;
    }

    @Action
    async getRoles() {
        const response = await roleApiService.getRoles();
        if (response?.success) {
            const data = response?.data || [];
            const adminRoleId = data
                .filter((role) => role.name === 'Admin' || role.name === 'Moderator')
                ?.map((r) => r._id);
            authStorageService.setAdminRoleIds(adminRoleId.join(','));
            this.SET_ROLES(data);
        } else {
            this.SET_ROLES([]);
        }
    }

    @Mutation
    SET_ROLES(roles: IRole[]) {
        this.roles = roles;
    }

    @Action
    setIsShowSystemMessageDialog(isShowSystemMessageDialog: boolean) {
        this.SET_IS_SHOW_SYSTEM_MESSAGE_DIALOG(isShowSystemMessageDialog);
    }

    @Mutation
    SET_IS_SHOW_SYSTEM_MESSAGE_DIALOG(isShowSystemMessageDialog: boolean) {
        this.isShowSystemMessageDialog = isShowSystemMessageDialog;
    }

    @Action
    setSystemMessage(systemMessage: ISystemMessage) {
        this.SET_SYSTEM_MESSAGE(systemMessage);
    }

    @Mutation
    SET_SYSTEM_MESSAGE(systemMessage: ISystemMessage) {
        this.systemMessage = systemMessage;
    }

    @Action
    setSystemMessageParameters(systemMessageParameters: object) {
        this.SET_SYSTEM_MESSAGE_PARAMETERS(systemMessageParameters);
    }

    @Mutation
    SET_SYSTEM_MESSAGE_PARAMETERS(systemMessageParameters: object) {
        this.systemMessageParameters = systemMessageParameters;
    }

    @Action
    setIsShowSurveyDialog(isShowSurveyDialog: boolean) {
        this.SET_IS_SHOW_SURVEY_DIALOG(isShowSurveyDialog);
    }

    @Mutation
    SET_IS_SHOW_SURVEY_DIALOG(isShowSurveyDialog: boolean) {
        this.isShowSurveyDialog = isShowSurveyDialog;
    }

    @Action
    setSurvey(survey: ISurvey) {
        this.SET_SURVEY(survey);
    }

    @Mutation
    SET_SURVEY(survey: ISurvey) {
        this.survey = survey;
    }
}

export const appModule = getModule(AppModule);
