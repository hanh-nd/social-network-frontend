<template>
    <div class="administrator-group-action-wrapper">
        <BaseThreeDotMenu>
            <el-dropdown-item>Bài viết đang chờ được duyệt</el-dropdown-item>
            <el-dropdown-item>Chỉnh sửa thông tin nhóm</el-dropdown-item>
        </BaseThreeDotMenu>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class AdministratorGroupAction extends GlobalMixin {}
</script>

<style lang="scss" scoped>
.administrator-group-action-wrapper {
    display: flex;
    flex-direction: row;
}
</style>
