<template>
    <input type="file" ref="file" @change="selectFile($event)" class="custom-file-input" hidden />
    <el-button type="primary" @click="onClickButtonSelectFile">
        <slot></slot>
    </el-button>
</template>

<script lang="ts">
import { MAX_UPLOAD_FILE_SIZE_IN_BYTE } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import fileApiService from '@/common/service/file.api.service';
import { get } from 'lodash';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
@Options({
    components: {},
    emits: ['on-file-uploaded'],
})
export default class UploadSingleButton extends GlobalMixin {
    @Prop() successMessage!: string;
    @Prop() errorMessage!: string;

    declare $refs: { file: HTMLFormElement };

    onBeforeUploadFile(file: File): boolean {
        const isValidFileSize = file.size < MAX_UPLOAD_FILE_SIZE_IN_BYTE;
        if (!isValidFileSize) {
            if (this.errorMessage) {
                this.showErrorNotificationFunction(this.errorMessage);
            }
            return false;
        }

        if (this.successMessage) {
            this.showSuccessNotificationFunction(this.successMessage);
        }
        return isValidFileSize;
    }

    async selectFile(event: Event) {
        const target = event.target;
        const file = get(target, 'files[0]', {}) as File;
        if (file.size) {
            const isFileValid = this.onBeforeUploadFile(file);
            if (isFileValid) {
                const filePreview = file;
                const formData = new FormData();
                formData.append('files', file);
                const response = await fileApiService.upload(formData);
                if (response.success) {
                    this.showSuccessNotificationFunction('Tải lên thành công.');
                    const file = get(response, 'data[0]');
                    if (file) {
                        this.$emit('on-file-uploaded', file, filePreview);
                    } else {
                        this.showErrorNotificationFunction('Có lỗi xảy ra, vui lòng thử lại sau.');
                    }
                } else {
                    this.showErrorNotificationFunction(response.message || 'Tải lên thất bại.');
                }
            }
        }
    }

    onClickButtonSelectFile() {
        this.$refs.file.click();
    }
}
</script>
<style lang="scss" scoped></style>
