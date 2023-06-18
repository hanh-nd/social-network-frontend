<template>
    <div class="question-list-wrapper" v-infinite-scroll="onLoadMore">
        <div class="question-list" v-if="questionList.length">
            <div class="question-item" v-for="question in questionList" :key="question._id">
                <QuestionItem :question="question" />
            </div>
        </div>
        <div class="empty" v-else>
            <el-empty description="Bạn chưa có câu hỏi nào cần trả lời." />
        </div>
    </div>
</template>

<script lang="ts">
import { IQuestion } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { profileModule } from '../../store';
import QuestionItem from './QuestionItem.vue';

@Options({
    components: {
        QuestionItem,
    },
    emits: ['on-load-more'],
})
export default class QuestionList extends GlobalMixin {
    get questionList(): IQuestion[] {
        return profileModule.questionList;
    }

    onLoadMore() {
        this.$emit(`on-load-more`);
    }
}
</script>

<style lang="scss" scoped>
.question-list-wrapper {
    .question-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
}
</style>
