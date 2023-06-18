<template>
    <el-dialog
        custom-class="base-survey-dialog"
        :model-value="isShowSurveyDialog"
        @open="onOpened"
        @closed="onCloseDialog"
        :title="survey.name"
        :width="deviceType === DeviceType.MOBILE ? '80%' : '30%'"
        center
    >
        <div class="description">
            <div class="content">
                {{ survey.description }}
            </div>
        </div>
        <div class="question">
            <div class="title">Câu hỏi:</div>
            <div class="content" v-html="survey.question"></div>
        </div>
        <div class="answer">
            <div class="title">Trả lời:</div>
            <div class="content">
                <div class="answer-content" v-if="survey.userAnswer?.answer">
                    {{ survey.userAnswer.answer }}
                </div>
                <div class="answer-form" v-else>
                    <BaseInputText
                        v-model:value="answerSurveyForm.answer"
                        placeholder="Nhập câu trả lời"
                        :error="translateYupError(answerSurveyForm.errors.answer as IYupError)"
                        type="textarea"
                        :autosize="{
                            minRows: 3,
                        }"
                        :maxLength="ValidationForm.INPUT_TEXT_AREA_MAX_LENGTH"
                    />
                </div>
            </div>
        </div>
        <div class="recommend" v-if="musics.length">
            <div class="title">Dưới đây là một số gợi ý dành cho bạn. Chúc bạn một ngày tốt lành :></div>
            <div class="music-item" v-for="(music, index) in musics" :key="index">
                <div class="title">{{ index + 1 }}.Tiêu đề: {{ music.title }}</div>
                <div class="link">
                    Link: <a :href="music.link" target="_blank">{{ music.link }}</a>
                </div>
            </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="onCloseDialog" round class="cancel-btn">Đóng</el-button>
                <el-button @click="onSubmit" type="primary" class="submit-btn" v-if="!survey.userAnswer?.answer"
                    >Gửi</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { DeviceType, SocketEvent, SurveyType } from '@/common/constants';
import { IAnswerSurveyBody, ISurvey, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import surveyApiService from '@/common/service/survey.api.service';
import { SocketProvider } from '@/plugins/socket.io';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { isArray } from 'lodash';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';

interface IMusic {
    title: string;
    link: string;
}

@Options({
    components: {},
    emits: ['on-close-dialog'],
})
export default class SurveyDialog extends GlobalMixin {
    SurveyType = SurveyType;
    musics: IMusic[] = [];

    get survey() {
        return appModule.survey;
    }

    async onOpened() {
        const surveyId = this.survey?._id;
        if (!surveyId) return;

        const response = await surveyApiService.getUserSurveyDetail(surveyId);
        if (response?.success) {
            const survey = response?.data;
            appModule.setSurvey(survey);
            const recommendedMusics = (response?.data?.userAnswer?.additionalData as any)?.recommendedMusics;
            this.musics = isArray(recommendedMusics) ? recommendedMusics : [];
        }

        SocketProvider.socket.on(SocketEvent.USER_SURVEY_MUSIC_RECOMMEND, (musics) => {
            this.musics = musics;
        });
    }

    get deviceType() {
        return appModule.deviceType;
    }

    get isShowSurveyDialog() {
        return appModule.isShowSurveyDialog;
    }

    onCloseDialog() {
        appModule.setIsShowSurveyDialog(false);

        SocketProvider.socket.off(SocketEvent.USER_SURVEY_MUSIC_RECOMMEND);
        this.musics = [];
    }

    answerSurveyForm = setup(() => {
        const initValues: IAnswerSurveyBody = {
            answer: '',
        };

        const schema = yup.object({
            answer: yup.string().required(),
        });

        const { resetForm, setValues, setFieldValue, errors, handleSubmit } = useForm<IAnswerSurveyBody>({
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
                const response = await surveyApiService.answerSurvey(survey._id, values);
                if (response.success) {
                    if (survey.type === SurveyType.CARE) {
                        this.showSuccessNotificationFunction('Cảm ơn bạn vì đã trả lời. Vui lòng đợi mình một chút...');
                    } else if (survey.type === SurveyType.ASK_AND_ANSWER) {
                        this.onCloseDialog();
                        this.showSuccessNotificationFunction('Cảm ơn bạn vì đã trả lời.');
                    }
                    survey.userAnswer = response?.data;
                    clearFormData();
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Có lỗi xảy ra khi trả lời khảo sát');
                }
            })();

        const { value: answer } = useField<string>('answer');

        return {
            answer,
            errors,
            submit,
            clearFormData,
            setValues,
            setFieldValue,
        };
    });

    async onSubmit() {
        await this.answerSurveyForm.submit(this.survey);
    }
}
</script>
<style lang="scss" scoped>
.base-survey-dialog {
    .description {
        .content {
            font-style: italic;
        }
    }
    .question,
    .answer,
    .recommend {
        .title {
            font-weight: 700;
        }
    }
}

.cancel-btn {
    border: none !important;
    background: transparent !important;
}
</style>
