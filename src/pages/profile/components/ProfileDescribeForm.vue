<template>
    <div class="profile-describe-form-wrapper">
        <div class="describe-form" v-if="isEditing">
            <div class="input-form">
                <BaseInputText
                    v-model:value="updateDescribeForm.describe"
                    placeholder="Mô tả về bạn..."
                    type="textarea"
                    :autosize="{
                        minRows: 2,
                    }"
                    :error="updateDescribeForm.errors.describe"
                />
            </div>
            <div class="submit-btn">
                <div @click="onSubmit">Lưu</div>
            </div>
        </div>
        <div class="describe-content" v-else>
            <div class="content">
                {{ user?.describe || 'Mô tả ngắn về bản thân bạn.' }}
            </div>
            <div class="edit-btn">
                <div @click="onEditDescribe">Edit</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IUser } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { profileModule } from '../store';
import { Watch } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class ProfileDescribeForm extends GlobalMixin {
    isEditing = false;

    get user() {
        return profileModule.profileUser || ({} as IUser);
    }

    updateDescribeForm = setup(() => {
        const initValues = {
            describe: this.user?.describe || '',
        };

        const schema = yup.object({
            describe: yup.string(),
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
            if (values.describe === this.user?.describe) {
                this.isEditing = false;
                return this.showSuccessNotificationFunction('Cập nhật mô tả thành công.');
            }
            const response = await userApiService.updateProfile({
                describe: values.describe,
            });
            if (response.success) {
                this.user.describe = values.describe;
                this.showSuccessNotificationFunction('Cập nhật mô tả thành công.');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Cập nhật mô tả thất bại');
            }

            this.isEditing = false;
        });

        const { value: describe } = useField<string>('describe');

        return {
            describe,
            errors,
            submit,
            clearFormData,
            setValues,
        };
    });

    @Watch('user')
    onUserChange() {
        this.updateDescribeForm.setValues({
            describe: this.user?.describe || '',
        });
    }

    onEditDescribe() {
        this.isEditing = true;
    }

    async onSubmit() {
        await this.updateDescribeForm.submit();
    }
}
</script>

<style lang="scss" scoped>
.profile-describe-form-wrapper {
    width: 300px;

    .describe-form {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;

        .input-form {
            width: 100%;
        }
    }
    .describe-content {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;

        .content {
            text-align: center;
        }
    }

    .submit-btn,
    .edit-btn {
        width: 0;
        padding-left: 4px;
        color: $color-green;
        cursor: pointer;
    }
}
</style>
