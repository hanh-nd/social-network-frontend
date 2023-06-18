<template>
    <div class="left-navigation-wrapper">
        <div class="title">Danh bạ</div>
        <div class="contact-list">
            <div class="search">
                <BaseInputText v-model:value="keyword" placeholder="Nhập để tìm kiếm" />
            </div>
            <div class="list">
                <ContactList :contactList="contactList" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { isEmpty } from 'lodash';
import { Options } from 'vue-class-component';
import { homeModule } from '../store';
import ContactList from './ContactList.vue';

@Options({
    components: {
        ContactList,
    },
})
export default class RightContact extends GlobalMixin {
    keyword = '';

    get loginUser() {
        return appModule.loginUser;
    }

    created(): void {
        homeModule.resetContactListQuery();
        homeModule.getSubscribing({ id: this.loginUser._id });
    }

    get contactList() {
        return isEmpty(this.keyword)
            ? homeModule.contactList
            : homeModule.contactList.filter((contact) => new RegExp(this.keyword, 'gi').test(contact.fullName));
    }
}
</script>

<style lang="scss" scoped>
.left-navigation-wrapper {
    padding: 16px;
    height: 100%;
    background: $color-white;
    border-radius: 6px 0 0 0;

    .contact-list {
        padding-right: 8px;
    }
}
</style>
