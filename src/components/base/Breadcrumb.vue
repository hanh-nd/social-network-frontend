<template>
    <div class="main-bread-wrapper">
        <div class="main-bread-content mx-auto">
            <el-breadcrumb class="bread-lists" separator="/">
                <el-breadcrumb-item
                    :to="page.link"
                    v-for="page in breadcrumb"
                    :key="page.index"
                    :class="{ current: page.index === breadcrumb.length }"
                    >{{ page.text }}</el-breadcrumb-item
                >
            </el-breadcrumb>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { IBreadcrumb } from '../../common/interfaces';
@Options({
    components: {},
})
export default class Breadcrumb extends Vue {
    @Prop({ default: () => [] }) readonly breadcrumb!: IBreadcrumb[];
}
</script>

<style lang="scss" scoped>
.main-bread-wrapper {
    background-color: transparent;
    height: 1%;
    box-shadow: 0px 1px $color-black-opacity-3;
    margin-bottom: 1px;
}
.main-bread-content {
    max-width: $content-max-width + $content-padding * 2;
    padding: 0 $content-padding;
}

.bread-lists {
    padding-top: 0.5%;
    padding-bottom: 0.65%;
}
:deep(.el-breadcrumb__inner) {
    color: $color-black !important;
    margin-top: 3px;
}
:deep(.el-breadcrumb__inner.is-link:hover) {
    color: $color-pink-red !important;
    cursor: pointer;
}
:deep(.el-breadcrumb__item span) {
    text-transform: capitalize;
}

@media screen and (max-width: map-get($grid-breakpoints, xs)) {
    :deep(.el-breadcrumb__inner) {
        font-weight: normal !important;
        font-size: 10px;
    }
    :deep(.el-breadcrumb__inner.is-link) {
        color: #1d1d1d;
    }
    .bread-lists {
        padding-top: 1%;
        padding-bottom: 1%;
    }
    :deep(.current) {
        height: 14.01px;
    }
}

@media screen and (min-width: 401px) {
    :deep(.el-breadcrumb__inner.is-link) {
        font-weight: normal !important;
        font-size: 14px;
        color: #1d1d1d;
    }
}
:deep(.el-breadcrumb__inner.is-link) {
    font-weight: normal !important;
    color: #1d1d1d;
    margin-top: 3px;
}
:deep(.current) {
    .el-breadcrumb__inner {
        color: #ea2548 !important;
    }
}
</style>
