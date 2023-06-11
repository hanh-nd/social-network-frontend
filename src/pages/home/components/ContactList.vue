<template>
    <div class="contact-list-wrapper">
        <div class="contact-list" v-if="contactList.length">
            <div class="contact-item" v-for="contact in contactList" :key="contact._id">
                <ContactItem :contact="contact" />
            </div>
        </div>
        <div class="empty" v-else>
            <el-empty
                description="Bạn chưa có ai trong danh sách để liên hệ. Hãy theo dõi thêm mọi người để mở rộng kết nối nhé."
            >
                <el-button type="primary">Xem gợi ý người dùng</el-button>
            </el-empty>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import ContactItem from './ContactItem.vue';

@Options({
    components: {
        ContactItem,
    },
    emits: ['on-load-more'],
})
export default class ContactList extends GlobalMixin {
    @Prop() contactList!: IUser[];
}
</script>

<style lang="scss" scoped>
.contact-list-wrapper {
    padding: 8px;

    .contact-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
}
</style>
