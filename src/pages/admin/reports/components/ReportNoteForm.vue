<template>
    <div class="profile-describe-form-wrapper">
        <div class="describe-form" v-if="isEditing">
            <div class="input-form">
                <BaseInputText
                    v-model:value="reportNoteForm.note"
                    placeholder="Nhập note"
                    :error="translateYupError(reportNoteForm.errors.note as IYupError)"
                />
            </div>
            <div class="submit-btn">
                <div @click="onSubmit">Lưu</div>
            </div>
        </div>
        <div class="describe-content" v-else>
            <div class="content">
                {{ report?.note }}
            </div>
            <div class="edit-btn">
                <div @click="onEditNote">Edit</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IReport, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminReportApiService from '@/common/service/admin.report.api.service';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class ReportNoteForm extends GlobalMixin {
    @Prop() report!: IReport;

    isEditing = false;

    reportNoteForm = setup(() => {
        const initValues = {
            note: this.report?.note || '',
        };

        const schema = yup.object({
            note: yup.string(),
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

        const submit = (report: IReport) =>
            handleSubmit(async (values) => {
                if (values.note === report?.note) {
                    this.isEditing = false;
                    return this.showSuccessNotificationFunction('Cập nhật note thành công.');
                }
                const response = await adminReportApiService.updateReport(report._id, {
                    note: values.note,
                });
                if (response.success) {
                    report.note = values.note;
                    this.showSuccessNotificationFunction('Cập nhật note thành công.');
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Cập nhật note thất bại');
                }

                this.isEditing = false;
            })();

        const { value: note } = useField<string>('note');

        return {
            note,
            errors,
            submit,
            clearFormData,
            setValues,
        };
    });

    @Watch('report')
    onReportChange() {
        this.reportNoteForm.setValues({
            note: this.report?.note || '',
        });
    }

    onEditNote() {
        this.isEditing = true;
    }

    async onSubmit() {
        await this.reportNoteForm.submit(this.report);
    }
}
</script>

<style lang="scss" scoped>
.profile-describe-form-wrapper {
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
        align-items: baseline;

        .content {
            text-align: center;
            word-break: break-word;
        }
    }

    .submit-btn,
    .edit-btn {
        width: 100px;
        padding-left: 4px;
        color: $color-green;
        cursor: pointer;
    }
}
</style>
