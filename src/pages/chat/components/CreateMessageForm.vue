<template>
    <div class="create-message-form-wrapper">
        <div class="content form-items">
            <BaseInputText
                v-model:value="messageForm.content"
                type="textarea"
                :autosize="true"
                placeholder="Nhập nội dung tin nhắn"
                @on-enter="onSubmit"
            >
                <template #iconRight>
                    <BaseEmojiPicker @on-pick-emoji="onPickEmoji" />
                </template>
            </BaseInputText>
        </div>

        <el-button
            @click="onSubmit"
            :disabled="!messageForm.content.trim() || isSending"
            :loading="isSending"
            class="message-btn"
            type="primary"
        >
            <template #loading>
                <BaseButtonInnerLoading />
            </template>
            {{ isSending ? '' : 'Gửi' }}
        </el-button>
    </div>
</template>

<script lang="ts">
import { SocketEvent } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { SocketProvider } from '@/plugins/socket.io';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class CreateMessageForm extends GlobalMixin {
    @Prop() chatId!: string;

    isSending = false;

    messageForm = setup(() => {
        const initValues = {
            content: '',
            mediaId: undefined,
        };

        const schema = yup.object({
            content: yup.string().required(),
            mediaId: yup.string().optional(),
        });

        const { resetForm, errors, handleSubmit, setFieldValue } = useForm({
            validationSchema: schema,
            initialValues: initValues,
        });

        const clearFormData = () => {
            resetForm({
                values: {
                    ...initValues,
                },
            });
        };

        const submit = (chatId: string) =>
            handleSubmit(async (values) => {
                this.isSending = true;
                const payload = {
                    chatId,
                    body: values,
                };
                SocketProvider.socket.emit(SocketEvent.USER_CHAT, payload);
                clearFormData();
                this.isSending = false;
            })();

        const { value: content } = useField<string>('content');
        const { value: mediaId } = useField<string>('mediaId');

        return {
            content,
            mediaId,
            errors,
            submit,
            clearFormData,
            setFieldValue,
        };
    });

    async onSubmit() {
        this.messageForm.submit(this.chatId);
    }

    onPickEmoji(emoji: string) {
        this.messageForm.setFieldValue('content', this.messageForm.content + emoji);
    }
}
</script>

<style lang="scss" scoped>
.create-message-form-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;

    .content {
        width: 100%;

        :deep(.input-container) {
            margin-bottom: 0;
        }
    }
}
</style>
