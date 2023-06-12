<template>
    <div class="question-item-wrapper" v-if="isShow">
        <div class="header">
            <div class="left-section">
                <div class="avatar">
                    <BaseRoundAvatar :user="sender" />
                </div>
                <div class="information" @click="goToSenderProfile">
                    <div class="name">{{ sender.fullName }}</div>
                    <div class="create-at">{{ parseDateTimeRelative(question.createdAt) }}</div>
                </div>
            </div>
            <div class="right-section">
                <BaseThreeDotMenu>
                    <el-dropdown-item @click="deleteQuestion">Xóa</el-dropdown-item>
                </BaseThreeDotMenu>
            </div>
        </div>

        <BaseDivider />
        <div class="content">
            <div class="question">
                <div class="title">Câu hỏi:</div>
                <div class="text">
                    {{ question.question }}
                </div>
            </div>

            <div class="answer">
                <div class="title">Câu trả lời:</div>
                <div class="text">
                    <AnswerQuestionForm :question="question" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IQuestion } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import questionApiService from '@/common/service/question.api.service';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import AnswerQuestionForm from './AnswerQuestionForm.vue';

@Options({
    components: {
        AnswerQuestionForm,
    },
})
export default class QuestionItem extends GlobalMixin {
    @Prop() question!: IQuestion;

    get sender() {
        return this.question.sender;
    }

    get isShow() {
        return !this.question.deletedAt;
    }

    goToSenderProfile() {
        if (!this.sender?._id) return;

        this.$router.push({
            name: this.PageName.PROFILE_PAGE,
            params: {
                id: this.sender._id,
            },
        });
    }

    async deleteQuestion() {
        if (!this.question?._id) return;
        const response = await questionApiService.deleteQuestion(this.question._id);
        if (response?.success) {
            this.question.deletedAt = new Date();
        } else {
            this.showErrorNotificationFunction(response?.message || 'Xóa câu hỏi thất bại.');
        }
    }
}
</script>

<style lang="scss" scoped>
.question-item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: $color-white;
    padding: 16px;
    border-radius: 8px;

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .left-section {
            display: flex;
            flex-direction: row;
            gap: 8px;
            align-items: flex-start;
        }

        .information {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            cursor: pointer;
        }
    }

    .content {
        display: flex;
        flex-direction: column;

        .title {
            font-weight: 500;
        }
    }
}
</style>
