<template>
    <div class="choose-avatar">
        <div class="message">Hãy chọn một hình đại diện thật đẹp của bạn!</div>
        <div class="upload-section">
            <el-upload
                action=""
                ref="upload"
                class="avatar-uploader"
                :on-change="handleUploadChange"
                :show-file-list="false"
                :auto-upload="false"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="action-btn">
                <div class="btn upload">
                    <el-button @click="updateAvatar" type="primary">Cập nhật</el-button>
                </div>
                <div class="btn skip">
                    <el-button @click="skip">Bỏ qua</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import fileApiService from '@/common/service/file.api.service';
import userApiService from '@/common/service/user.api.service';
import { Plus } from '@element-plus/icons-vue';
import { UploadFile } from 'element-plus';
import { Options } from 'vue-class-component';

@Options({
    components: { Plus },
})
export default class ChooseAvatar extends GlobalMixin {
    avatarId = '';
    file: UploadFile | null = null;
    imageUrl = '';

    handleUploadChange(file: UploadFile) {
        this.file = file;
        this.submitUpload();
    }

    async submitUpload() {
        const formData = new FormData();
        if (this.file) {
            formData.append('files', this.file.raw!);
            const response = await fileApiService.upload(formData);
            if (response.success) {
                const file = response.data[0];
                this.avatarId = file?.id;
                this.imageUrl = `${process.env.VUE_APP_API_URL}/files/${this.avatarId}`;
            } else {
                this.showErrorNotificationFunction(response?.message);
            }
        }
    }

    async updateAvatar() {
        if (!this.avatarId) return;

        const response = await userApiService.updateProfile({
            avatarId: this.avatarId,
        });

        if (response.success) {
            this.showSuccessNotificationFunction(`Cập nhật ảnh đại diện thành công.`);
            this.goToNextStep();
        } else {
            this.showErrorNotificationFunction(response?.message);
        }
    }

    async skip() {
        this.goToNextStep();
    }

    async goToNextStep() {
        this.$router.push({
            name: this.PageName.HOME_PAGE,
        });
    }
}
</script>
<style lang="scss" scoped>
.message {
    padding-bottom: 16px;
}

.upload-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;

    :deep(.avatar-uploader) {
        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }
    }

    img {
        width: 256px;
        height: 256px;
        object-fit: cover;
    }

    .el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 256px;
        height: 256px;
        text-align: center;
    }
}

.action-btn {
    display: flex;
    flex-direction: row;
    width: 256px;

    .btn {
        flex: 1;
    }
}
</style>
