<template>
    <el-dialog
        custom-class="base-system-message-dialog"
        :model-value="isShowSystemMessageDialog"
        @closed="onCloseDialog"
        :title="systemMessage.type === SystemMessageType.INFO ? `Thông báo` : `Cảnh báo`"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="content-wrapper" v-html="content"></div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCloseDialog" round class="cancel-btn">Đồng ý</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { DeviceType, SystemMessageType } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { appModule } from '@/plugins/vuex/appModule';
import { Options } from 'vue-class-component';

@Options({
    components: {},
    emits: ['on-close-dialog'],
})
export default class SystemMessageDialog extends GlobalMixin {
    SystemMessageType = SystemMessageType;

    get systemMessage() {
        return appModule.systemMessage;
    }

    get template() {
        return this.systemMessage.fullTemplate || this.systemMessage.template;
    }

    get parameters() {
        return appModule.systemMessageParameters;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get isShowSystemMessageDialog() {
        return appModule.isShowSystemMessageDialog;
    }

    get content() {
        let _content = this.template || '';
        for (const key in this.parameters) {
            const val = this.parameters[key];

            _content = _content.replace(`@{${key}}`, val);
        }

        return _content;
    }

    onCloseDialog() {
        appModule.setIsShowSystemMessageDialog(false);
    }
}
</script>
<style lang="scss" scoped>
.content-wrapper {
    .bold {
        font-weight: 500;
    }
}

.cancel-btn {
    border: none !important;
    background: transparent !important;
}
</style>
