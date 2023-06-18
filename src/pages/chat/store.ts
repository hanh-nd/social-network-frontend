import { IUser } from '@/common/interfaces';
import chatApiService from '@/common/service/chat.api.service';
import searchApiService from '@/common/service/search.api.service';
import store from '@/plugins/vuex';
import { cloneDeep } from 'lodash';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { INIT_GET_MESSAGE_LIST_QUERY } from './constants';
import { IChat, IGetMessageListQuery, IMessage } from './interfaces';

@Module({
    name: 'chat',
    stateFactory: true,
    dynamic: true,
    namespaced: true,
    store,
})
class ChatModule extends VuexModule {
    chatList: IChat[] = [];
    chatDetail: IChat = {} as IChat;
    messageList: IMessage[] = [];
    isShowChatInfoDrawer = false;
    messageListQuery: IGetMessageListQuery = cloneDeep(INIT_GET_MESSAGE_LIST_QUERY);
    isShowCreateChatDialog = false;
    searchUsers: IUser[] = [];

    @Action
    async getChatList() {
        const response = await chatApiService.getUserChats();
        if (response?.success) {
            this.SET_CHAT_LIST(response?.data || []);
        } else {
            this.SET_CHAT_LIST([]);
        }
    }

    @Mutation
    SET_CHAT_LIST(chatList: IChat[]) {
        this.chatList = chatList;
    }

    @Action
    async getChatDetail(id: string) {
        const response = await chatApiService.getChatDetail(id);
        if (response?.success) {
            this.SET_CHAT_DETAIL(response?.data || {});
        } else {
            this.SET_CHAT_DETAIL({} as IChat);
        }
    }

    @Action
    setChatDetail(chatDetail: IChat) {
        this.SET_CHAT_DETAIL(chatDetail);
    }

    @Mutation
    SET_CHAT_DETAIL(chatDetail: IChat) {
        this.chatDetail = chatDetail;
    }

    @Action
    async getMessageList({ id, append = false }: { id: string; append?: boolean }) {
        const response = await chatApiService.getMessages(id, this.messageListQuery);

        if (response?.success) {
            if (append) {
                this.APPEND_MESSAGE_LIST(response?.data || []);
            } else {
                this.SET_MESSAGE_LIST(response?.data || []);
            }
            return response?.data || [];
        }
        if (append) {
            this.APPEND_MESSAGE_LIST([]);
        } else {
            this.SET_MESSAGE_LIST([]);
        }
        return [];
    }

    @Action
    async unshiftMessageList(message: IMessage) {
        this.UNSHIFT_MESSAGE_LIST([message]);
    }

    @Mutation
    SET_MESSAGE_LIST(messageList: IMessage[]) {
        this.messageList = messageList;
    }

    @Mutation
    APPEND_MESSAGE_LIST(messageList: IMessage[]) {
        this.messageList.push(...messageList);
    }

    @Mutation
    UNSHIFT_MESSAGE_LIST(messageList: IMessage[]) {
        this.messageList.unshift(...messageList);
    }

    @Action
    setIsShowChatInfoDrawer(isShowChatInfoDrawer: boolean) {
        this.SET_IS_SHOW_CHAT_INFO_DRAWER(isShowChatInfoDrawer);
    }

    @Mutation
    SET_IS_SHOW_CHAT_INFO_DRAWER(isShowChatInfoDrawer: boolean) {
        this.isShowChatInfoDrawer = isShowChatInfoDrawer;
    }

    @Action
    setMessageListQuery(messageListQuery: IGetMessageListQuery) {
        this.SET_MESSAGE_LIST_QUERY(messageListQuery);
    }

    @Mutation
    SET_MESSAGE_LIST_QUERY(messageListQuery: IGetMessageListQuery) {
        Object.assign(this.messageListQuery, messageListQuery);
    }

    @Action
    resetMessageListQuery() {
        this.RESET_MESSAGE_LIST_QUERY();
    }

    @Mutation
    RESET_MESSAGE_LIST_QUERY() {
        this.messageListQuery = cloneDeep(INIT_GET_MESSAGE_LIST_QUERY);
    }

    @Action
    setIsShowCreateChatDialog(isShowCreateChatDialog: boolean) {
        this.SET_IS_SHOW_CREATE_CHAT_DIALOG(isShowCreateChatDialog);
    }

    @Mutation
    SET_IS_SHOW_CREATE_CHAT_DIALOG(isShowCreateChatDialog: boolean) {
        this.isShowCreateChatDialog = isShowCreateChatDialog;
    }

    @Action
    async getSearchUsers(keyword: string) {
        const response = await searchApiService.searchUsers({
            keyword,
        });
        if (response?.success) {
            this.SET_SEARCH_USERS(response?.data || []);
        } else {
            this.SET_SEARCH_USERS([]);
        }
    }

    @Mutation
    SET_SEARCH_USERS(searchUsers: IUser[]) {
        this.searchUsers = searchUsers;
    }
}

export const chatModule = getModule(ChatModule);
