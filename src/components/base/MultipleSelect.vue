<template>
    <div class="form-group position-relative" :class="{ 'is-error': error, 'is-focus': isFocus }">
        <label v-if="label" class="text-start mb-2"
            >{{ label }}<span v-if="isRequired" class="mark-required">*</span></label
        >
        <el-select
            v-model="selectedValue"
            :placeholder="selectedValue?.length > 0 ? '' : placeholder"
            :filterable="filterable"
            :remote="remote"
            :remote-method="remoteMethod"
            :clearable="clearable"
            :disabled="isDisabled"
            multiple
            :collapse-tags="collapseTags"
            collapse-tags-tooltip
            :max-collapse-tags="maxCollapseTags"
            popper-class="select-options"
            @keyup="press"
            @change="change"
            @blur="onBlur"
            @focus="onFocus"
            ref="multipleSelect"
            :teleported="false"
            :multiple-limit="limit"
        >
            <slot name="options" v-if="isCustomOption" />
            <template v-for="option in options" v-else :key="option.id">
                <el-option :label="option.name" :value="option.id" :id="`option_${option.id}`" :style="optionStyle" />
            </template>
        </el-select>
        <div class="validation-error text-start" :class="{ 'd-block': error }">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { KeyCode } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';
export interface ISelectForm extends GlobalMixin {
    selectWrapper: Record<string, unknown>;
}

@Options({
    components: {},
    emits: ['change', 'blur'],
})
export default class MultipleSelect extends GlobalMixin {
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: '' }) readonly rules!: string | Record<string, unknown>;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: true }) readonly collapseTags!: boolean;
    @Prop({ default: 3 }) readonly maxCollapseTags!: number;
    @Prop({ default: false }) readonly filterable!: boolean;
    @Prop({ default: () => [] }) readonly options!: Record<string, unknown>[];
    @Prop({ default: true }) readonly clearable!: boolean;
    @Prop({ default: false }) readonly isCustomOption!: boolean;
    @Prop({ default: false }) readonly remote!: boolean;
    @Prop({ default: () => [] }) readonly remoteMethod!: CallableFunction;
    @Prop({ default: 0 }) readonly limit!: number;

    @Model('value', { type: Array as () => string[] | number[] })
    readonly selectedValue!: string[] | number[];

    optionStyle: Record<string, string> = {
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'unset',
        height: 'auto',
    };
    isFocus = false;

    get selectedRef() {
        return this.$refs.multipleSelect;
    }

    press(event: KeyboardEvent): void {
        if (event.code === KeyCode.ENTER) {
            (this.$refs.select as any).blur();
        }
    }

    change(value: any): void {
        this.$nextTick(() => {
            this.$emit('change', value);
        });
    }

    onFocus(): void {
        this.isFocus = true;
        const clientWidth = (this.selectedRef as ISelectForm)?.selectWrapper?.clientWidth;
        this.optionStyle = {
            ...this.optionStyle,
            maxWidth: `${clientWidth}px`,
        };
    }

    onBlur() {
        this.isFocus = false;
        this.$emit('blur');
    }
}
</script>

<style lang="scss" scoped>
.form-group label {
    text-align: initial;
    width: 100%;
    font-weight: bold;
    margin-bottom: 6px;
    font-size: 15px;
    color: $color-black-2v;
    font-weight: 600;
}
:deep(.el-select) {
    width: 100% !important;

    .el-icon.el-select__caret {
        width: 20px;
        content: url(@/assets/images/common/arrow-icon.svg);
    }

    .el-input .el-select__caret {
        transform: none;
    }
}

.validation-error {
    font-size: 12px;
    color: $color-red;
    margin: 5px 0;
}
:deep(.select-options) {
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    text-align: left;
}
:deep(.el-input) {
    height: 48px;
    box-shadow: none;
    .el-icon-arrow-up:before {
        content: '\e78f';
    }
}
:deep(.popper__arrow) {
    display: none !important;
}
.mark-required {
    color: $color-red;
}
:deep(.el-select-dropdown__list) {
    padding: 0px !important;
}
:deep(.el-select__input) {
    cursor: pointer !important;
}
:deep(.el-select__tags) {
    max-width: unset !important;
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

:deep(.el-select-dropdown .el-select-dropdown__item.selected) {
    color: $color-green !important;
}

:deep(.el-select-dropdown__item.selected::after) {
    color: $color-green !important;
}

.is-error {
    :deep(.el-select .el-input__wrapper),
    :deep(.el-select .is-focus .el-input__wrapper) {
        box-shadow: 0 0 0 1px $color-red !important;
        background-color: $color-green-1 !important;
    }
    label {
        color: $color-red;
    }
}
</style>
