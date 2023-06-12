<template>
    <div class="question-screen-wrapper">
        <div class="header">
            <div class="title">Câu hỏi dành cho bạn</div>
            <el-radio-group v-model="questionType" @change="onChange">
                <el-radio-button :label="QuestionType.ALL">Tất cả</el-radio-button>
                <el-radio-button :label="QuestionType.UNANSWERED">Chưa trả lời</el-radio-button>
            </el-radio-group>
        </div>
        <div class="question-list">
            <QuestionList @on-load-more="onLoadMore" />
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { profileModule } from '../../store';
import QuestionList from './QuestionList.vue';

@Options({
    components: {
        QuestionList,
    },
})
export default class QuestionScreen extends GlobalMixin {
    QuestionType = {
        ALL: 'Tất cả',
        UNANSWERED: 'Chưa trả lời',
    };
    questionType = this.QuestionType.ALL;

    onChange(questionType: string) {
        profileModule.resetQuestionListQuery();
        profileModule.setIsFetchedAllQuestionList(false);
        if (questionType == this.QuestionType.ALL) {
            profileModule.setQuestionListQuery({
                pending: 0,
            });
        } else {
            profileModule.setQuestionListQuery({
                pending: 1,
            });
        }
        profileModule.getQuestionList({ append: false });
    }

    get currentPage() {
        return profileModule.questionListQuery.page as number;
    }

    get isFetchedAllQuestionList() {
        return profileModule.isFetchedAllQuestionList;
    }

    created(): void {
        this.loadData();
    }

    loadData() {
        profileModule.resetQuestionListQuery();
        profileModule.setIsFetchedAllSubscribeRequestList(false);
        profileModule.getQuestionList({ append: false });
    }

    onLoadMore() {
        if (this.isFetchedAllQuestionList) return;

        profileModule.setQuestionListQuery({
            page: this.currentPage + 1,
        });

        profileModule.getQuestionList({ append: true });
    }
}
</script>

<style lang="scss" scoped>
.question-screen-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .header {
        background: $color-white;
        padding: 16px;
        border-radius: 8px;

        .title {
            font-size: 20px;
            font-weight: 500;
            margin-bottom: 8px;
        }
    }

    .question-list {
        margin-bottom: 16px;
    }
}
</style>
