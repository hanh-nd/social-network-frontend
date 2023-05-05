<template>
    <div class="form-group d-flex" :class="{ 'is-focus': isFocus }">
        <el-autocomplete
            v-model="inputValue"
            :fetch-suggestions="querySearch"
            :placeholder="placeholder"
            @select="handleSelect"
            :size="size"
            @focus="onFocus"
            @blur="onBlur"
            @keyup="onChangeKeyword"
            :teleported="false"
        >
            <template #prefix>
                <slot name="prefix"></slot>
            </template>
            <template #default="{ item }">
                <slot name="options" :item="item" />
            </template>
        </el-autocomplete>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['on-change-keyword', 'blur', 'select-suggestion'],
})
export default class Autocomplete extends GlobalMixin {
    @Prop({ default: () => [] }) readonly options!: string[];
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Model('value', { type: [String, Number] })
    readonly inputValue!: string;

    isFocus = false;

    querySearch(queryString: string, cb: CallableFunction): void {
        cb(this.options);
    }

    onFocus() {
        this.isFocus = true;
    }

    onChangeKeyword() {
        this.$emit('on-change-keyword');
    }

    onBlur() {
        this.isFocus = false;
        this.$emit('blur');
    }

    handleSelect(value: any): void {
        this.$emit('select-suggestion', value);
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-autocomplete) {
    width: 100% !important;
}

.is-focus {
    label {
        color: $color-green;
    }

    :deep(.el-textarea__inner),
    :deep(.el-input__wrapper) {
        background-color: $color-green-1 !important;
        box-shadow: 0 0 0 1px $color-green !important;
    }
}
</style>
