<template>
    <el-dialog
        custom-class="update-user-dialog"
        :model-value="isShowUpdateSurveyDialog"
        @closed="onClose"
        title="Chỉnh sửa thông tin chi tiết"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="form">
            <div class="form-item">
                <BaseInputText
                    v-model:value="updateSurveyForm.name"
                    label="Tên"
                    placeholder="Nhập tên"
                    :error="translateYupError(updateSurveyForm.errors.name as IYupError)"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="updateSurveyForm.description"
                    label="Mô tả"
                    placeholder="Nhập mô tả"
                    :error="translateYupError(updateSurveyForm.errors.description as IYupError)"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <div class="form-item">
                <BaseInputText
                    v-model:value="updateSurveyForm.question"
                    label="Câu hỏi"
                    placeholder="Nhập câu hỏi"
                    :error="translateYupError(updateSurveyForm.errors.question as IYupError)"
                    type="textarea"
                    :autosize="{
                        minRows: 3,
                    }"
                    :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                />
            </div>
            <div class="form-item">
                <BaseSingleSelect
                    v-model:value="updateSurveyForm.type"
                    label="Loại khảo sát"
                    placeholder="Chọn loại khảo sát"
                    :options="typeOptions"
                    :error="translateYupError(updateSurveyForm.errors.type as IYupError)"
                />
            </div>
            <div class="form-item">
                <BaseDatePicker
                    v-model:value="updateSurveyForm.askDate"
                    label="Thời gian khảo sát"
                    placeholder="Chọn thời gian khảo sát"
                    :error="translateYupError(updateSurveyForm.errors.askDate as IYupError)"
                    type="datetime"
                    :dateFormat="DateFormat.YYYY_MM_DD_HH_MM_ss"
                    :valueFormat="DateFormat.YYYY_MM_DD_HH_MM_ss"
                    @on-enter="onSubmit"
                />
            </div>
            <div class="form-item">
                <BaseSingleSelect
                    v-model:value="updateSurveyForm.urgent"
                    label="Ngay lập tức"
                    placeholder="Chọn mức độ khảo sát"
                    :options="urgentOptions"
                    :error="translateYupError(updateSurveyForm.errors.urgent as IYupError)"
                />
            </div>
            <div class="form-item">
                <div>Lặp lại</div>
                <el-checkbox-group v-model="updateSurveyForm.repeatDays">
                    <el-checkbox :label="1">Thứ 2</el-checkbox>
                    <el-checkbox :label="2">Thứ 3</el-checkbox>
                    <el-checkbox :label="3">Thứ 4</el-checkbox>
                    <el-checkbox :label="4">Thứ 5</el-checkbox>
                    <el-checkbox :label="5">Thứ 6</el-checkbox>
                    <el-checkbox :label="6">Thứ 7</el-checkbox>
                    <el-checkbox :label="7">Chủ nhật</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <template #footer>
            <span class="footer">
                <el-button @click="onSubmit()" class="submit-btn" type="primary">Chỉnh sửa</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { SurveyType, SurveyTypeName } from '@/common/constants';
import { ISurvey, IUpdateSurveyBody, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminSurveyApiService from '@/common/service/admin.survey.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { adminSurveyModule } from '../store';

@Options({
    components: {},
})
export default class UpdateSurveyDialog extends GlobalMixin {
    get isShowUpdateSurveyDialog() {
        return adminSurveyModule.isShowUpdateSurveyDialog;
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get selectedSurvey() {
        return adminSurveyModule.selectedSurvey;
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
        adminSurveyModule.setIsShowUpdateSurveyDialog(false);
        adminSurveyModule.setSelectedSurvey({} as ISurvey);
    }

    updateSurveyForm = setup(() => {
        const initValues: IUpdateSurveyBody = {
            name: undefined,
            description: undefined,
            question: undefined,
            type: undefined,
            askDate: undefined,
            urgent: undefined,
            repeatDays: undefined,
        };

        const schema = yup.object({
            name: yup.string(),
            description: yup.string(),
            question: yup.string(),
            type: yup.string(),
            askDate: yup.string(),
            urgent: yup.bool(),
            repeatDays: yup.array().of(yup.number()),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<IUpdateSurveyBody>({
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

        const submit = (survey: ISurvey) =>
            handleSubmit(async (values) => {
                const response = await adminSurveyApiService.updateSurvey(survey._id, values);
                if (response.success) {
                    adminSurveyModule.setIsShowUpdateSurveyDialog(false);
                    Object.assign(survey, values);
                    clearFormData();
                    this.showSuccessNotificationFunction('Cập nhật thông tin thành công');
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Cập nhật thông tin thất bại');
                }
            })();

        const { value: name } = useField<string>('name');
        const { value: description } = useField<string>('description');
        const { value: question } = useField<string>('question');
        const { value: type } = useField<SurveyType>('type');
        const { value: askDate } = useField<Date>('askDate');
        const { value: urgent } = useField<boolean>('urgent');
        const { value: repeatDays } = useField<number[]>('repeatDays');

        return {
            name,
            description,
            question,
            type,
            askDate,
            urgent,
            repeatDays,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    @Watch('selectedSurvey')
    onSelectedSurveyChange() {
        this.updateSurveyForm.setValues(this.selectedSurvey);
    }

    async onSubmit() {
        await this.updateSurveyForm.submit(this.selectedSurvey);
    }
}
</script>

<style lang="scss" scoped></style>
