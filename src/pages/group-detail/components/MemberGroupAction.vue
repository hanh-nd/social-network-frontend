<template>
    <div class="member-group-action-wrapper">
        <BaseThreeDotMenu>
            <el-dropdown-item>Xem bài viết đang chờ duyệt</el-dropdown-item>
            <el-dropdown-item>Rời khỏi nhóm</el-dropdown-item>
        </BaseThreeDotMenu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class MemberGroupAction extends GlobalMixin {}
</script>

<style lang="scss" scoped>
.member-group-action-wrapper {
    display: flex;
    flex-direction: row;
}
</style>
