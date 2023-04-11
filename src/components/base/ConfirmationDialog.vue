<template>
    <el-dialog
        custom-class="base-confirmation-dialog"
        :model-value="isShowConfirmationDialog"
        @closed="onCloseDialog"
        :title="title"
        :width="deviceType === DEVICE_TYPE.MOBILE ? '80%' : '30%'"
        center
    >
        <span>{{ message }}</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onClickCancelButton" round class="cancel-btn">{{
                    $t('app.dialog.confirmation.cancel')
                }}</el-button>
                <el-button
                    :disabled="isSendingRequest"
                    :loading="isSendingRequest"
                    type="primary"
                    @click="onClickConfirmButton"
                    round
                    ><template #loading>
                        <BaseButtonInnerLoading />
                    </template>
                    {{
                        isSendingRequest ? '' : $t('app.dialog.confirmation.confirm')
                    }}</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { DeviceType } from '@/common/constants';
import { appModule } from '@/plugins/vuex/appModule';
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['on-close-dialog', 'on-click-cancel-button', 'on-click-confirm-button'],
})
export default class ConfirmationDialog extends Vue {
    @Prop({ default: false }) isShowConfirmationDialog!: boolean;
    @Prop() title!: string;
    @Prop() message!: string;
    @Prop() isSendingRequest!: boolean;

    DEVICE_TYPE = DeviceType;

    get deviceType() {
        return appModule.deviceType;
    }

    onCloseDialog() {
        this.$emit('on-close-dialog');
    }

    onClickCancelButton() {
        this.onCloseDialog();
        this.$emit('on-click-cancel-button');
    }

    onClickConfirmButton() {
        this.onCloseDialog();
        this.$emit('on-click-confirm-button');
    }
}
</script>
<style lang="scss" scoped>
.cancel-btn {
    border: none !important;
    background: transparent !important;
}
</style>
