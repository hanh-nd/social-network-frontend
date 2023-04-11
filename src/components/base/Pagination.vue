<template>
    <div v-if="total > pageSize" class="container">
        <el-pagination
            popper-class="pagination"
            layout="pager"
            :page-size="pageSize"
            :total="total"
            v-model:current-page="currentPage"
            @current-change="onCurrentChange"
        />
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['on-change-page'],
})
export default class Pagination extends Vue {
    @Prop({ required: true }) total!: number;
    @Prop({ required: true }) pageSize!: number;
    @Model('selectedPage', { type: Number }) currentPage!: number;
    onCurrentChange() {
        this.$emit('on-change-page');
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: center;
}
:deep(.el-pager) {
    li {
        background: transparent;
        border-radius: 100px;
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
    }

    li.is-active,
    li.is-active:hover {
        background: $color-red;
        color: $color-white;
    }

    li:hover {
        color: $color-red;
    }
}
</style>
