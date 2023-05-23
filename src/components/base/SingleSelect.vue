<template>
    <div class="form-group d-flex" :class="{ 'flex-column': !isHorizontal, 'is-error': error, 'is-focus': isFocus }">
        <label v-if="label" class="text-start mb-2" :class="{ 'w-100': !isHorizontal, 'w-30 mt-1': isHorizontal }"
            >{{ label }}<span v-if="isRequired" class="mark-required">*</span>
        </label>
        <div class="form-container position-relative" :class="{ 'w-100': !isHorizontal, 'w-70': isHorizontal }">
            <el-select
                v-model="selectedValue"
                :placeholder="selectedValue ? '' : placeholder"
                :filterable="filterable"
                :remote="remote"
                :remote-method="remoteMethod"
                popper-class="select-options"
                :size="size"
                :disabled="isDisabled"
                @change="onChange"
                @focus="onFocus"
                @blur="onBlur"
                @visible-change="onVisibleChange"
                ref="singleSelect"
                :teleported="false"
            >
                <slot name="options" v-if="isCustomOption" />
                <template v-for="option in options" v-else :key="option.id">
                    <el-option
                        :label="option.name"
                        :value="option.id"
                        :id="`option_${option.id}`"
                        :style="optionStyle"
                    />
                </template>
            </el-select>
            <div class="validation-error text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';
export interface ISelectForm extends GlobalMixin {
    selectWrapper: Record<string, unknown>;
}

@Options({
    components: {},
    emits: ['change', 'blur', 'visible-change'],
})
export default class SingleSelect extends GlobalMixin {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: () => [] }) readonly options!: Record<string, unknown>[];
    @Prop({ default: false }) readonly filterable!: boolean;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly isCustomOption!: boolean;
    @Prop({ default: false }) readonly remote!: boolean;
    @Prop({ default: () => [] }) readonly remoteMethod!: CallableFunction;

    @Model('value', { type: [String, Number] })
    readonly selectedValue!: string;

    optionStyle: Record<string, string> = {
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'unset',
        height: 'auto',
    };

    isFocus = false;

    get singleSelectRef() {
        return this.$refs.singleSelect;
    }

    onChange(value: string): void {
        this.$emit('change', value);
    }

    onFocus(): void {
        this.isFocus = true;
        const clientWidth = (this.singleSelectRef as ISelectForm)?.selectWrapper?.clientWidth;
        this.optionStyle = {
            ...this.optionStyle,
            maxWidth: `${clientWidth}px`,
        };
    }

    onBlur() {
        this.isFocus = false;
        this.$emit('blur');
    }

    onVisibleChange(visible: boolean): void {
        this.$emit('visible-change', visible);
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-select) {
    width: 100% !important;

    .el-icon {
        width: 20px;
        content: url(@/assets/images/common/arrow-icon.svg);
    }

    .el-input .el-select__caret {
        transform: none;
    }

    .el-select-dropdown__item.selected {
        color: $color-green;
    }
}
label {
    font-size: 15px;
    color: $color-black-2v;
    font-weight: 600;
}
:deep(.select-options) {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    text-align: left;
    left: 0px !important;
}
:deep(.el-input) {
    height: 48px;
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
}
.mark-required {
    color: $color-red;
}
.w-30 {
    word-break: break-word;
    width: 30%;
}
.w-70 {
    width: 70%;
}
.validation-error {
    font-size: 12px;
    color: $color-red;
    margin: 5px 0;
}
.position-relative {
    margin-bottom: 24px;
}
.is-focus {
    label {
        color: $color-green;
    }
}
:deep(.el-select .el-input.is-focus .el-input__wrapper),
:deep(.el-select .el-input .el-input__wrapper.is-focus) {
    background-color: $color-green-1;
    box-shadow: 0 0 0 1px $color-green !important;
}

.is-error {
    :deep(.el-select .el-input__wrapper) {
        box-shadow: 0 0 0 1px $color-red !important;
        background-color: $color-green-1 !important;
    }
    label {
        color: $color-red;
    }
}
</style>
