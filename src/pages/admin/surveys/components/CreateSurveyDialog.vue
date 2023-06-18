<template>
    <el-dialog
        custom-class="create-survey-dialog"
        :model-value="isShowCreateSurveyDialog"
        @closed="onClose"
        title="Tạo mới khảo sát"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="form">
            <div class="form-item">
                <BaseInputText
                    v-model:value="createSurveyForm.name"
                    label="Tên"
                    placeholder="Nhập tên"
                    :error="translateYupError(createSurveyForm.errors.name as IYupError)"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="createSurveyForm.description"
                    label="Mô tả"
                    placeholder="Nhập mô tả"
                    :error="translateYupError(createSurveyForm.errors.description as IYupError)"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="createSurveyForm.question"
                    label="Câu hỏi"
                    placeholder="Nhập câu hỏi"
                    :error="translateYupError(createSurveyForm.errors.question as IYupError)"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <div class="form-item">
                <BaseSingleSelect
                    v-model:value="createSurveyForm.type"
                    label="Loại khảo sát"
                    placeholder="Chọn loại khảo sát"
                    :options="typeOptions"
                    :error="translateYupError(createSurveyForm.errors.type as IYupError)"
                />
            </div>
            <div class="form-item">
                <BaseDatePicker
                    v-model:value="createSurveyForm.askDate"
                    label="Thời gian khảo sát"
                    placeholder="Chọn thời gian khảo sát"
                    :error="translateYupError(createSurveyForm.errors.askDate as IYupError)"
                    type="datetime"
                    :dateFormat="DateFormat.YYYY_MM_DD_HH_MM_ss"
                    :valueFormat="DateFormat.YYYY_MM_DD_HH_MM_ss"
                    @on-enter="onSubmit"
                />
            </div>
            <div class="form-item">
                <BaseSingleSelect
                    v-model:value="createSurveyForm.urgent"
                    label="Ngay lập tức"
                    placeholder="Chọn mức độ khảo sát"
                    :options="urgentOptions"
                    :error="translateYupError(createSurveyForm.errors.urgent as IYupError)"
                />
            </div>
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit()" class="submit-btn" type="primary">Tạo mới</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { SurveyType, SurveyTypeName } from '@/common/constants';
import { ICreateSurveyBody, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminSurveyApiService from '@/common/service/admin.survey.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { adminSurveyModule } from '../store';

@Options({
    components: {},
})
export default class CreateSurveyDialog extends GlobalMixin {
    get isShowCreateSurveyDialog() {
        return adminSurveyModule.isShowCreateSurveyDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get typeOptions() {
        return Object.values(SurveyType).map((type) => {
            return {
                id: type,
                name: SurveyTypeName[type],
            };
        });
    }

    get urgentOptions() {
        return [
            {
                id: false,
                name: 'Không',
            },
            {
                id: true,
                name: 'Có',
            },
        ];
    }

    onClose() {
        adminSurveyModule.setIsShowCreateSurveyDialog(false);
    }

    createSurveyForm = setup(() => {
        const initValues: ICreateSurveyBody = {
            name: '',
            description: '',
            question: '',
            type: SurveyType.CARE,
            askDate: new Date(),
            urgent: false,
        };

        const schema = yup.object({
            name: yup.string().required(),
            description: yup.string().required(),
            question: yup.string().required(),
            type: yup.string().required(),
            askDate: yup.string().required(),
            urgent: yup.bool().required(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<ICreateSurveyBody>({
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
            const response = await adminSurveyApiService.createSurvey(values);
            if (response.success) {
                adminSurveyModule.setIsShowCreateSurveyDialog(false);
                clearFormData();
                this.showSuccessNotificationFunction('Tạo mới khảo sát thành công');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra khi tạo mới khảo sát');
            }
        });

        const { value: name } = useField<string>('name');
        const { value: description } = useField<string>('description');
        const { value: question } = useField<string>('question');
        const { value: type } = useField<SurveyType>('type');
        const { value: askDate } = useField<Date>('askDate');
        const { value: urgent } = useField<boolean>('urgent');

        return {
            name,
            description,
            question,
            type,
            askDate,
            urgent,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.createSurveyForm.submit();
    }
}
</script>

<style lang="scss" scoped></style>
