import chatApiService from '@/common/service/chat.api.service';
import store from '@/plugins/vuex';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { IChat, IMessage } from './interfaces';

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
    async getMessageList(id: string, append = false) {
        const response = await chatApiService.getMessages(id);
        if (response?.success) {
            if (append) {
                this.APPEND_MESSAGE_LIST(response?.data || []);
            } else {
                this.SET_MESSAGE_LIST(response?.data || []);
            }
        } else {
            if (append) {
                this.APPEND_MESSAGE_LIST([]);
            } else {
                this.SET_MESSAGE_LIST([]);
            }
        }
    }

    @Action
    async appendMessage(message: IMessage) {
        this.APPEND_MESSAGE_LIST([message]);
    }

    @Mutation
    SET_MESSAGE_LIST(messageList: IMessage[]) {
        this.messageList = messageList;
    }

    @Mutation
    APPEND_MESSAGE_LIST(messageList: IMessage[]) {
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
}

export const chatModule = getModule(ChatModule);
