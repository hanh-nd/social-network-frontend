<template>
    <div class="form-group d-flex" :class="{ 'flex-column': !isHorizontal, 'is-error': error, 'is-focus': isFocus }">
        <label
            v-if="label"
            class="text-start mb-2"
            :class="{
                'w-100': !isHorizontal,
                'label mt-1': isHorizontal,
            }"
        >
            {{ label }}
            <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div class="position-relative" :class="{ 'w-100': !isHorizontal, input: isHorizontal }">
            <el-input
                v-model="inputData"
                :placeholder="placeholder"
                ref="input"
                type="password"
                :readonly="isReadonly"
                :disabled="isDisabled"
                show-password
                @focus="onFocus"
                @blur="onBlur"
                @keyup="onKeyup"
            >
            </el-input>
            <div class="validation-error text-start d-block">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { KeyCode } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import { InputInstance } from 'element-plus';
import { Options } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['on-enter', 'blur'],
})
export default class InputPassword extends GlobalMixin {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: false }) readonly isHorizontal!: boolean;

    isFocus = false;

    onFocus() {
        this.isFocus = true;
        (this.$refs.input as InputInstance).focus();
    }

    onBlur() {
        this.isFocus = false;
        this.$emit('blur');
    }

    @Model('value', { type: [String, Number] })
    readonly inputData!: string;

    onKeyup(event: KeyboardEvent) {
        if (event.code === KeyCode.ENTER) {
            this.$emit('on-enter');
        }
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-input) {
    height: 48px;
}

label {
    font-size: 15px;
    color: $color-black-2v;
    font-weight: 600;
}
.input-password-icon {
    cursor: pointer;
}
.fa {
    font-size: 16px;
}
.mark-required {
    color: $color-red;
}
.is-focus {
    label {
        color: $color-green;
    }
    :deep(.el-input__wrapper) {
        background-color: $color-green-1;
        box-shadow: 0 0 0 1px $color-green !important;
    }
    :deep(.el-icon) {
        color: $color-green;
    }
}

.validation-error {
    font-size: 12px;
    color: $color-red;
    margin: 5px 0;
}

.is-error {
    :deep(.el-input .el-input__wrapper) {
        box-shadow: 0 0 0 1px $color-red !important;
        background-color: $color-green-1 !important;
    }
    label {
        color: $color-red;
    }
    :deep(.el-icon) {
        color: $color-red;
    }
}

:deep(.el-icon) {
    margin-right: 15px;
    transform: scale(1.5);
    &:hover {
        color: $color-green;
    }
}
</style>
