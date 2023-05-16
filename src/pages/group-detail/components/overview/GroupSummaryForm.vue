<template>
    <div class="group-summary-form-wrapper">
        <div class="summary-form" v-if="isAdministrator() && isEditing">
            <div class="input-form">
                <BaseInputText
                    v-model:value="updateSummaryForm.summary"
                    placeholder="Mô tả về nhóm..."
                    type="textarea"
                    :autosize="{
                        minRows: 2,
                    }"
                    :error="updateSummaryForm.errors.summary"
                />
            </div>
            <div class="submit-btn">
                <el-button @click="onSubmit" type="primary">Lưu</el-button>
            </div>
        </div>
        <div class="summary-content" v-else>
            <div class="edit-btn" v-if="isAdministrator()">
                <div @click="onEditDescribe">{{ group?.summary ? 'Sửa mô tả' : 'Thêm mô tả' }}</div>
            </div>
            <div class="content">
                {{ group?.summary || 'Bạn hãy thêm mô tả để giúp mọi người hiểu hơn về nhóm của bạn nhé.' }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import groupApiService from '@/common/service/group.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { groupDetailModule } from '../../store';

@Options({
    components: {},
})
export default class ProfileDescribeForm extends GlobalMixin {
    isEditing = false;

    get group() {
        return groupDetailModule.groupDetail;
    }

    get administratorIds() {
        return this.group?.administrators?.map((admin) => `${admin.user?._id}`) || [];
    }

    get loginUser() {
        return appModule.loginUser;
    }

    isAdministrator() {
        return this.administratorIds.includes(`${this.loginUser?._id}`);
    }

    updateSummaryForm = setup(() => {
        const initValues = {
            summary: this.group?.summary || '',
        };

        const schema = yup.object({
            summary: yup.string(),
        });

        const { resetForm, setValues, errors, handleSubmit } = useForm({
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

        const submit = handleSubmit(async (values) => {
            if (values.summary === this.group?.summary) {
                this.isEditing = false;
                return this.showSuccessNotificationFunction('Cập nhật mô tả thành công.');
            }
            const response = await groupApiService.updateGroup(this.group._id, {
                summary: values.summary,
            });
            if (response.success) {
                this.group.summary = values.summary;
                this.showSuccessNotificationFunction('Cập nhật mô tả thành công.');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Cập nhật mô tả thất bại');
            }

            this.isEditing = false;
        });

        const { value: summary } = useField<string>('summary');

        return {
            summary,
            errors,
            submit,
            clearFormData,
            setValues,
        };
    });

    @Watch('group')
    onUserChange() {
        this.updateSummaryForm.setValues({
            summary: this.group?.summary || '',
        });
    }

    onEditDescribe() {
        this.isEditing = true;
    }

    async onSubmit() {
        await this.updateSummaryForm.submit();
    }
}
</script>

<style lang="scss" scoped>
.group-summary-form-wrapper {
    .summary-form {
        display: flex;
        flex-direction: column;

        .input-form {
            width: 100%;
        }
    }
    .summary-content {
        display: flex;
        flex-direction: column;
    }

    .edit-btn {
        color: $color-green;
        cursor: pointer;
        font-weight: 500;
        font-size: 16px;
    }
}
</style>
