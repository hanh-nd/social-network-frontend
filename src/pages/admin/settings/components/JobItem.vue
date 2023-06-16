<template>
    <div class="job-item-wrapper">
        <div class="left-section">
            <div class="section key">
                <div class="name">Tên job:</div>
                <div class="value">
                    {{ job.key }}
                </div>
            </div>
            <div class="section next-time">
                <div class="name">Lần quét kế tiếp:</div>
                <div class="value">
                    {{ parseDateTimeRelative(job.nextDate) }}
                </div>
            </div>
            <div class="section cron-time">
                <div class="name">Cron time:</div>
                <div class="value" v-if="!isEditing">
                    {{ job.cronTime }}
                </div>
                <div class="value form-item" v-else>
                    <BaseInputText
                        v-model:value="updateJobForm.cronTime"
                        :error="translateYupError(updateJobForm.errors.cronTime as IYupError)"
                    />
                </div>
            </div>
            <div class="section status">
                <div class="name">Trạng thái:</div>
                <div class="value" v-if="!isEditing">
                    {{ job.active ? `Đang hoạt động` : `Ngừng hoạt động` }}
                </div>
                <div class="value form-item" v-else>
                    <BaseSingleSelect
                        v-model:value="updateJobForm.active"
                        :error="translateYupError(updateJobForm.errors.active as IYupError)"
                        :options="activeOptions"
                    />
                </div>
            </div>
        </div>
        <div class="right-section">
            <el-button type="primary" @click="submit" v-if="isEditing">Lưu</el-button>
            <el-button type="primary" @click="edit" v-else>Chỉnh sửa</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminSettingsApiService from '@/common/service/admin.settings.api.service';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IJob } from '../settings.interfaces';

@Options({})
export default class JobItem extends GlobalMixin {
    @Prop() job!: IJob;

    get activeOptions() {
        return [
            {
                id: true,
                name: 'Hoạt động.',
            },
            {
                id: false,
                name: 'Ngừng hoạt động.',
            },
        ];
    }

    isEditing = false;

    mounted(): void {
        this.updateJobForm.setValues({
            cronTime: this.job.cronTime,
            active: this.job.active,
        });
    }

    updateJobForm = setup(() => {
        const initValues = {
            cronTime: this.job?.cronTime,
            active: this.job?.active,
        };

        const schema = yup.object({
            cronTime: yup.string(),
            active: yup.bool(),
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

        const submit = (job: IJob) =>
            handleSubmit(async (values) => {
                const response = await adminSettingsApiService.updateJob(job.key, values);
                if (response.success) {
                    Object.assign(job, values);
                    this.showSuccessNotificationFunction('Cập nhật thành công.');
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Cập nhật thất bại');
                }

                this.isEditing = false;
            })();

        const { value: cronTime } = useField<string>('cronTime');
        const { value: active } = useField<string>('active');

        return {
            cronTime,
            active,
            errors,
            submit,
            clearFormData,
            setValues,
        };
    });

    submit() {
        this.updateJobForm.submit(this.job);
    }

    edit() {
        this.isEditing = true;
    }
}
</script>

<style lang="scss" scoped>
.job-item-wrapper {
    display: flex;
    flex-direction: row;
    background: $color-gray;
    border-radius: 8px;
    padding: 16px;

    .section {
        display: flex;
        flex-direction: row;

        .name {
            font-weight: 500;
            width: 150px;
        }

        .value {
            flex: 1;
        }
    }

    .left-section {
        flex: 1;
    }
    .right-section {
        align-self: flex-start;
        justify-self: flex-end;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .job-item-wrapper {
        .section {
            flex-direction: column;
        }
    }
}
</style>
