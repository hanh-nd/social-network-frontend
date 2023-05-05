<template>
    <div class="form-group flex-column position-relative">
        <label class="mb-2" v-if="label">{{ label }} <span v-if="isRequired" class="mark-required">*</span></label>
        <el-input
            v-model="inputData"
            type="number"
            :placeholder="placeholder"
            :readonly="isReadonly"
            :disabled="isDisabled"
            :error="true"
            :min="min"
            :max="max"
            @keydown="preventInput"
            @change="onChange"
        />
        <div class="validation-error text-start" :class="{ 'd-block': error }">
            {{ error }}
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Model, Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class InputNumber extends GlobalMixin {
    @Prop({ default: '' }) readonly label!: string;
    @Prop({ default: '' }) readonly placeholder!: string;
    @Prop({ default: '' }) readonly error!: string;
    @Prop({ default: false }) readonly isRequired!: string;
    @Prop({ default: false }) readonly isReadonly!: boolean;
    @Prop({ default: false }) readonly isDisabled!: boolean;
    @Prop({ default: '' }) readonly min!: number;
    @Prop({ default: NaN }) readonly max!: number;
    @Prop({ default: false }) readonly allowDecimal!: boolean;

    @Model('value', { type: Number })
    readonly inputData!: number;

    preventInput(event: KeyboardEvent): void {
        switch (event.key) {
            // allow paste
            // allow copy
            // allow select all
            case 'v':
            case 'c':
            case 'a':
                if (!event.ctrlKey) {
                    event.preventDefault();
                }
                break;

            default:
                break;
        }
    }

    onChange(data: number) {
        this.$emit('on-change', data);
    }
}
</script>

<style lang="scss" scoped></style>
