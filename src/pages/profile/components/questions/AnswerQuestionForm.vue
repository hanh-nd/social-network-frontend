<template>
    <div class="answer-question-form-wrapper">
        <div class="answer-form" v-if="isEditing">
            <div class="input-form">
                <BaseInputText
                    v-model:value="answerQuestionForm.answer"
                    placeholder="Hãy trả lời câu hỏi này..."
                    type="textarea"
                    :autosize="{
                        minRows: 2,
                    }"
                    :error="translateYupError(answerQuestionForm.errors.answer as IYupError)"
                />
            </div>
            <div class="submit-btn">
                <el-button type="primary" @click="onSubmit">Lưu</el-button>
                <el-button @click="onSubmit">Hủy</el-button>
            </div>
        </div>
        <div class="answer-content" v-else>
            <div class="content">
                {{ question?.answer || 'Chưa có câu trả lời.' }}
            </div>
            <div class="edit-btn">
                <el-button type="primary" @click="onEditDescribe">Trả lời</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IQuestion, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import questionApiService from '@/common/service/question.api.service';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class ProfileDescribeForm extends GlobalMixin {
    @Prop() question!: IQuestion;

    isEditing = false;

    answerQuestionForm = setup(() => {
        const initValues = {
            answer: '',
        };

        const schema = yup.object({
            answer: yup.string().required(),
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

        const submit = (question: IQuestion) =>
            handleSubmit(async (values) => {
                if (values.answer === question?.answer) {
                    this.isEditing = false;
                    return this.showSuccessNotificationFunction('Cập câu trả lời thành công.');
                }
                const response = await questionApiService.updateQuestion(question._id, {
                    answer: values.answer,
                });
                if (response.success) {
                    question.answer = values.answer;
                    this.showSuccessNotificationFunction('Cập câu trả lời thành công.');
                } else {
                    this.showErrorNotificationFunction(response?.message || 'Cập nhật câu trả lời thất bại');
                }

                this.isEditing = false;
            })();

        const { value: answer } = useField<string>('answer');

        return {
            answer,
            errors,
            submit,
            clearFormData,
            setValues,
        };
    });

    mounted(): void {
        this.answerQuestionForm.setValues({
            answer: this.question.answer || '',
        });
    }

    onEditDescribe() {
        this.isEditing = true;
    }

    async onSubmit() {
        await this.answerQuestionForm.submit(this.question);
    }

    onCancel() {
        this.answerQuestionForm.setValues({
            answer: this.question.answer,
        });
        this.isEditing = false;
    }
}
</script>

<style lang="scss" scoped>
.answer-question-form-wrapper {
    width: 300px;

    .answer-form {
        display: flex;
        flex-direction: column;

        .input-form {
            width: 100%;
        }
    }
    .answer-content {
        display: flex;
        flex-direction: column;

        .content {
            margin-bottom: 4px;
        }
    }
}
</style>
