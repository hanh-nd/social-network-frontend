import { IGetSurveyListQuery, ISurvey } from '@/common/interfaces';
import adminSurveyApiService from '@/common/service/admin.survey.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_SURVEY_LIST_QUERY } from './constants';

@Module({
    name: 'admin-surveys',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class AdminSurveyModule extends VuexModule {
    surveyList: ISurvey[] = [];
    surveyListQuery: IGetSurveyListQuery = cloneDeep(INIT_GET_SURVEY_LIST_QUERY);
    isFetchedAllSurveyList = false;
    isShowCreateSurveyDialog = false;
    isShowUpdateSurveyDialog = false;
    selectedSurvey: ISurvey = {} as ISurvey;

    @Action
    async getSurveyList() {
        const response = await adminSurveyApiService.getSurveyList(this.surveyListQuery);
        if (response.success) {
            const data = response?.data || [];
            if (!data.length) {
                this.SET_IS_FETCHED_ALL_SURVEY_LIST(true);
            }
            this.SET_SURVEY_LIST(data);
        } else {
            this.SET_SURVEY_LIST([]);

            this.SET_IS_FETCHED_ALL_SURVEY_LIST(true);
        }
    }

    @Mutation
    SET_SURVEY_LIST(surveyList: ISurvey[]) {
        this.surveyList = surveyList;
    }

    @Action
    setIsFetchedAllSurveyList(isFetchedAllSurveyList: boolean) {
        this.SET_IS_FETCHED_ALL_SURVEY_LIST(isFetchedAllSurveyList);
    }

    @Mutation
    SET_IS_FETCHED_ALL_SURVEY_LIST(isFetchedAllSurveyList: boolean) {
        this.isFetchedAllSurveyList = isFetchedAllSurveyList;
    }

    @Action
    resetSurveyListQuery() {
        this.RESET_SURVEY_LIST_QUERY();
        this.SET_IS_FETCHED_ALL_SURVEY_LIST(false);
    }

    @Mutation
    RESET_SURVEY_LIST_QUERY() {
        this.surveyListQuery = cloneDeep(INIT_GET_SURVEY_LIST_QUERY);
    }

    @Action
    setSurveyListQuery(surveyListQuery: IGetSurveyListQuery) {
        this.SET_SURVEY_LIST_QUERY(surveyListQuery);
    }

    @Mutation
    SET_SURVEY_LIST_QUERY(surveyListQuery: IGetSurveyListQuery) {
        this.surveyListQuery = {
            ...this.surveyListQuery,
            ...surveyListQuery,
        };
    }

    @Action
    setIsShowCreateSurveyDialog(isShowCreateSurveyDialog: boolean) {
        this.SET_IS_SHOW_CREATE_SURVEY_DIALOG(isShowCreateSurveyDialog);
    }

    @Mutation
    SET_IS_SHOW_CREATE_SURVEY_DIALOG(isShowCreateSurveyDialog: boolean) {
        this.isShowCreateSurveyDialog = isShowCreateSurveyDialog;
    }

    @Action
    setIsShowUpdateSurveyDialog(isShowUpdateSurveyDialog: boolean) {
        this.SET_IS_SHOW_UPDATE_SURVEY_DIALOG(isShowUpdateSurveyDialog);
    }

    @Mutation
    SET_IS_SHOW_UPDATE_SURVEY_DIALOG(isShowUpdateSurveyDialog: boolean) {
        this.isShowUpdateSurveyDialog = isShowUpdateSurveyDialog;
    }

    @Action
    setSelectedSurvey(selectedSurvey: ISurvey) {
        this.SET_SELECTED_SURVEY(selectedSurvey);
    }

    @Mutation
    SET_SELECTED_SURVEY(selectedSurvey: ISurvey) {
        this.selectedSurvey = selectedSurvey;
    }
}
export const adminSurveyModule = getModule(AdminSurveyModule);
