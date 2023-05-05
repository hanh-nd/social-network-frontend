<template>
    <div class="form-group d-flex" :class="{ 'flex-column': !isHorizontal, 'is-error': error, 'is-focus': isFocus }">
        <label v-if="label" class="text-start mb-2" :class="{ 'w-100': !isHorizontal, 'w-30 mt-1': isHorizontal }"
            >{{ label }} <span v-if="isRequired" class="mark-required">*</span></label
        >
        <div class="position-relative" :class="{ 'w-100': !isHorizontal, 'w-70': isHorizontal }">
            <el-date-picker
                v-model="dateValue"
                :type="type"
                :placeholder="placeholder"
                :disabled-date="calculateDisabledDates"
                :format="dateFormat"
                :value-format="valueFormat"
                :size="size"
                :clearable="isClearable"
                :disabled="isDisabled"
                :default-value="defaultValue"
                @focus="onFocus"
                @blur="onBlur"
                @change="changeValue"
                @panel-change="onNavigateCalendar"
                :teleported="false"
            />
            <div class="validation-error text-start" :class="{ 'd-block': error }">
                {{ error }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { DateFormat } from '@/common/constants';
import { GlobalMixin } from '@/common/mixins';
import moment from 'moment';
import { Options } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';

@Options({
    components: {},
    emits: ['changeValue', 'blur', 'navigateCalendar'],
})
export default class DatePicker extends GlobalMixin {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: 'default' }) readonly size!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: 'date' }) readonly type!: string;
    @Prop({ default: DateFormat.YYYY_MM_DD }) readonly dateFormat!: string;
    @Prop({ default: DateFormat.YYYY_MM_DD }) readonly valueFormat!: string;
    @Prop({ default: null }) readonly minDate!: string | Date;
    @Prop({ default: null }) readonly maxDate!: string | Date;
    @Prop({ default: false }) readonly isHorizontal!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: false }) readonly isDisabledWeekend!: boolean;
    @Prop({ default: true }) readonly isClearable!: boolean;
    @Prop({ default: null }) readonly defaultValue!: Date | string;
    @Prop({ default: [] }) readonly disabledDates!: string[];
    @Model('value', { type: String })
    readonly dateValue!: string | Date;

    calculateDisabledDates(time: Date): boolean {
        const { minDate, maxDate } = this.$props as {
            minDate: Date | string;
            maxDate: Date | string;
            isDisabledWeekend: boolean;
        };
        let result = false;
        if (minDate?.toString()?.length) {
            result = result || moment(time).isSameOrBefore(moment(minDate));
        }
        if (maxDate?.toString()?.length) {
            result = result || moment(time).isSameOrAfter(moment(maxDate));
        }
        return result;
    }

    changeValue(time: Date): void {
        this.$emit('changeValue', time);
    }

    onNavigateCalendar(date: Date): void {
        this.$emit('navigateCalendar', date);
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

:deep(.el-date-table .el-date-table-cell__text:hover),
:deep(.el-date-table td.today .el-date-table-cell__text),
:deep(.el-year-table td.today .cell),
:deep(.el-year-table .cell:hover),
:deep(.el-month-table td.today .cell),
:deep(.el-month-table .cell:hover),
:deep(.el-date-picker__header-label:hover),
:deep(.el-date-picker__header button .el-icon:hover) {
    color: $color-green !important;
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
    :deep(.el-date-editor .el-input__wrapper) {
        box-shadow: 0 0 0 1px $color-red !important;
        background-color: $color-green-1 !important;
    }
    label {
        color: $color-red;
    }
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
