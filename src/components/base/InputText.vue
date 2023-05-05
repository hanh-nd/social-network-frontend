<template>
    <div class="d-flex" :class="{ 'flex-column': !isHorizontal, 'is-error': error, 'is-focus': isFocus }">
        <label
            v-if="label"
            class="text-start mb-2 d-flex align-items-center"
            :class="{
                'w-100': !isHorizontal,
                'label mt-1': isHorizontal,
            }"
        >
            {{ label }}<span v-if="isRequired" class="mark-required"> *</span></label
        >
        <div class="position-relative" :class="{ 'w-100': !isHorizontal, input: isHorizontal }">
            <div class="icon-left" v-if="hasIconLeft">
                <slot name="iconLeft"></slot>
            </div>
            <el-input
                ref="input"
                v-model="inputData"
                :placeholder="placeholder"
                :type="type"
                :autosize="autosize"
                :resize="resize"
                :class="{ 'input-wrapper-icon-left': hasIconLeft }"
                :readonly="isReadonly"
                :disabled="isDisabled"
                :error="true"
                :size="size"
                :maxlength="maxLength"
                @focus="onFocus"
                @blur="onBlur"
                @keyup="onKeyup"
                @input="onInput"
                @change="onChange"
            />
            <div v-if="!isHorizontal && error" class="validation-error text-start">
                {{ error }}
            </div>
        </div>
    </div>
    <div class="d-flex" v-if="isHorizontal">
        <div class="w-25"></div>
        <div class="w-75 validation-error text-start">{{ error }}&nbsp;</div>
    </div>
</template>

<script lang="ts">
import { KeyCode, ValidationForm } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['on-change', 'on-enter', 'blur', 'input'],
})
export default class InputText extends GlobalMixin {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly name!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: 'text' }) readonly type!: string;
    @Prop({ default: 'none' }) readonly resize!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: ValidationForm.INPUT_TEXT_MAX_LENGTH }) readonly maxLength!: number;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly autosize!: boolean | object;

    @Model('value', { type: [String] })
    readonly inputData!: string;

    declare $refs: {
        input: {
            focus: CallableFunction;
            blur: CallableFunction;
        };
    };

    isFocus = false;

    get hasIconLeft() {
        return !!this.$slots.iconLeft;
    }

    onFocus() {
        this.isFocus = true;
    }
    onChange(value: string) {
        this.$emit('on-change', value);
    }

    onBlur() {
        this.isFocus = false;
        this.$emit('blur');
    }

    onKeyup(event: KeyboardEvent) {
        if (event.code === KeyCode.ENTER) {
            this.$emit('on-enter');
        }
    }

    onInput(value: string | number) {
        this.isFocus = true;
        this.$emit('input', value);
    }

    focus() {
        this.$nextTick(() => this.$refs.input.focus());
    }

    blur() {
        this.$refs.input.blur();
    }
}
</script>

<style lang="scss" scoped>
/** Remove Arrows/Spinners */
/* Chrome, Safari, Edge, Opera */
:deep(.el-input__inner::-webkit-outer-spin-button),
:deep(.el-input__inner::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
}

label {
    font-size: 15px;
    color: $color-black-2v;
    font-weight: 600;
}
:deep(.el-input) {
    height: 48px;
    box-shadow: none;
}
.mark-required {
    color: $color-red;
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

.validation-error {
    font-size: 12px;
    color: $color-red;
    margin: 5px 0;
}

.position-relative {
    margin-bottom: 24px;
}

.is-error {
    :deep(.el-input .el-input__wrapper) {
        box-shadow: 0 0 0 1px $color-red !important;
        background-color: $color-green-1 !important;
    }
    label {
        color: $color-red;
    }
}

.icon-left {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 18px;
    margin: auto;
    z-index: 1;
    display: flex;
    align-items: center;
}

.input-wrapper-icon-left {
    :deep(.el-input__wrapper) {
        padding-left: 42px;
    }
}
</style>
