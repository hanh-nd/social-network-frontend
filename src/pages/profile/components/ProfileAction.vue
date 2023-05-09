<template>
    <div class="profile-action-wrapper">
        <el-button>HIIH</el-button>
        <el-button>HIIH</el-button>
        <el-button>HIIH</el-button>
        <el-button>HIIH</el-button>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({
    components: {},
})
export default class ProfileAction extends GlobalMixin {}
</script>

<style lang="scss" scoped>
.profile-action-wrapper {
    display: flex;
    flex-direction: row;
    padding-right: 16px;
}
</style>
