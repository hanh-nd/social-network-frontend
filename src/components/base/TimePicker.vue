<template>
    <div
        class="form-group d-flex time-select"
        :class="{ 'flex-column': !isHorizontal, 'is-error': error, 'is-focus': isFocus }"
    >
        <label v-if="label" class="text-start mb-2" :class="{ 'w-100': !isHorizontal, 'w-30 mt-1': isHorizontal }"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div class="position-relative" :class="{ 'w-100': !isHorizontal, 'w-70': isHorizontal }">
            <el-time-select
                v-model="timeValue"
                :placeholder="placeholder"
                :size="size"
                :start="start"
                :end="end"
                :step="step"
                :clearable="isClearable"
                :disabled="isDisabled"
                :max-time="maxTime"
                :min-time="minTime"
                @focus="onFocus"
                @blur="onBlur"
                @change="changeValue"
                :teleported="false"
            />
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

@Options({
    components: {},
    emits: ['changeValue', 'blur'],
})
export default class TimePicker extends GlobalMixin {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: '00:00' }) readonly start!: string;
    @Prop({ default: '23:59' }) readonly end!: string;
    @Prop({ default: '' }) readonly minTime!: string;
    @Prop({ default: '' }) readonly maxTime!: string;
    @Prop({ default: '00:15' }) readonly step!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: true }) readonly isClearable!: boolean;
    @Prop({ default: null }) readonly defaultValue!: Date | string;
    @Model('value', { type: String })
    readonly timeValue!: string | Date;

    changeValue(time: Date): void {
        this.$emit('changeValue', time);
    }

    isFocus = false;

    onFocus() {
        this.isFocus = true;
    }

    onBlur() {
        this.isFocus = false;
        this.$emit('blur');
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-input) {
    width: 100% !important;
    height: 48px;
}

label {
    font-size: 15px;
    color: $color-black-2v;
    font-weight: 600;
}

.mark-required {
    color: $color-red;
}

.is-error {
    :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px $color-red !important;
        background-color: $color-green-1 !important;
    }
    label {
        color: $color-red;
    }
}

:deep(.el-select .el-input.is-focus .el-input__wrapper),
:deep(.el-select .el-input .el-input__wrapper.is-focus) {
    background-color: $color-green-1;
    box-shadow: 0 0 0 1px $color-green !important;
}

:deep(.el-select-dropdown__item.selected) {
    color: $color-green;
}

.is-focus {
    label {
        color: $color-green;
    }
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
.w-30 {
    word-break: break-word;
    width: 30%;
}
.w-70 {
    width: 70%;
}

.position-relative {
    margin-bottom: 24px;
}
</style>
