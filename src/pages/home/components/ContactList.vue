<template>
    <div class="contact-list-wrapper">
        <div class="contact-item" v-for="contact in contactList" :key="contact._id">
            <ContactItem :contact="contact" />
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
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px;
}
</style>
