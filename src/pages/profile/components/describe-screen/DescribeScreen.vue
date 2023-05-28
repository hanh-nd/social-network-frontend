<template>
    <div class="describe-screen-wrapper">
        <div class="describe-screen-container">
            <div class="page-header">
                <div class="page-title">Giới thiệu</div>
                <div class="page-action" v-if="isUser">
                    <el-button type="primary" @click="isEditing = !isEditing" v-if="!isEditing">Chỉnh sửa</el-button>
                    <el-button type="primary" @click="onSubmit" v-if="isEditing">Lưu</el-button>
                    <el-button @click="onCancel" v-if="isEditing">Hủy bỏ</el-button>
                </div>
            </div>
            <div class="content">
                <div class="section overview">
                    <div class="header">Thông tin cá nhân</div>
                    <div class="content">
                        <div class="content-row">
                            <div class="title col-4">Giới tính</div>
                            <div class="value col-6" v-if="!isEditing">
                                {{ GenderName[detail.gender || Gender.OTHER] }}
                            </div>
                            <div class="form-item col-6" v-else>
                                <BaseSingleSelect
                                    v-model:value="updateDetailForm.gender"
                                    :options="genderOptions"
                                    :error="translateYupError(updateDetailForm.errors.gender as IYupError)"
                                />
                            </div>
                        </div>
                        <div class="content-row">
                            <div class="title col-4">Ngày sinh</div>
                            <div class="value col-6" v-if="!isEditing">
                                {{
                                    detail.birthday
                                        ? parseDateTime(detail.birthday, DateFormat.DD_MM_YYYY_DASH)
                                        : 'Không có thông tin'
                                }}
                                -
                                {{ `${zodiac.symbol} ${zodiac.name}` }}
                            </div>
                            <div class="form-item col-6" v-else>
                                <BaseDatePicker
                                    v-model:value="updateDetailForm.birthday"
                                    placeholder="Ngày sinh"
                                    :error="translateYupError(updateDetailForm.errors.birthday as IYupError)"
                                />
                            </div>
                        </div>
                        <div class="content-row">
                            <div class="title col-4">Tình trạng</div>
                            <div class="value col-6" v-if="!isEditing">
                                {{ RelationshipName[detail.relationship || Relationship.SINGLE] }}
                            </div>
                            <div class="form-item col-6" v-else>
                                <BaseSingleSelect
                                    v-model:value="updateDetailForm.relationship"
                                    :options="relationshipOptions"
                                    :error="translateYupError(updateDetailForm.errors.relationship as IYupError)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <BaseDivider />
                <div class="section contact">
                    <div class="header">Thông tin liên hệ</div>
                    <div class="content">
                        <div class="content-row">
                            <div class="title col-4">Địa chỉ chi tiết</div>
                            <div class="value col-6" v-if="!isEditing">
                                {{
                                    detail.address
                                        ? [
                                              detail.address?.detail,
                                              detail.address?.ward,
                                              detail.address?.district,
                                              detail.address?.province,
                                          ]
                                              .filter((e) => e)
                                              .join(', ')
                                        : 'Không có thông tin'
                                }}
                            </div>
                            <div class="form-item col-6" v-else>
                                <BaseInputText
                                    v-model:value="updateDetailForm.address.province"
                                    label="Tỉnh/Thành phố"
                                    placeholder="Tỉnh/Thành phố"
                                    :error="translateYupError(updateDetailForm.errors['address.province'] as IYupError)"
                                />
                                <BaseInputText
                                    v-model:value="updateDetailForm.address.district"
                                    label="Quận/Huyện"
                                    placeholder="Quận/Huyện"
                                    :error="translateYupError(updateDetailForm.errors['address.district'] as IYupError)"
                                />
                                <BaseInputText
                                    v-model:value="updateDetailForm.address.ward"
                                    label="Phường/Xã"
                                    placeholder="Phường/Xã"
                                    :error="translateYupError(updateDetailForm.errors['address.ward'] as IYupError)"
                                />
                                <BaseInputText
                                    v-model:value="updateDetailForm.address.detail"
                                    label="Địa chỉ chi tiết"
                                    placeholder="Địa chỉ chi tiết"
                                    :error="translateYupError(updateDetailForm.errors['address.detail'] as IYupError)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <BaseDivider />
                <div class="section work">
                    <div class="header">Công việc</div>
                    <div class="content-row">
                        <div class="title col-4">Công ty</div>
                        <div class="value col-6" v-if="!isEditing">
                            {{
                                detail.work
                                    ? [detail.work?.position, detail.work?.name].filter((e) => e).join(' tại ')
                                    : 'Không có thông tin'
                            }}
                        </div>
                        <div class="form-item col-6" v-else>
                            <BaseInputText
                                v-model:value="updateDetailForm.work.name"
                                label="Công ty"
                                placeholder="Công ty"
                                :error="translateYupError(updateDetailForm.errors['work.name'] as IYupError)"
                            />
                            <BaseInputText
                                v-model:value="updateDetailForm.work!.position"
                                label="Chức danh"
                                placeholder="Chức danh"
                                :error="translateYupError(updateDetailForm.errors['work.position'] as IYupError)"
                            />
                        </div>
                    </div>
                </div>
                <BaseDivider />
                <div class="section education">
                    <div class="header">Trường học</div>
                    <div class="content-row">
                        <div class="title col-4">Trường học</div>
                        <div class="value col-6" v-if="!isEditing">
                            {{
                                detail.education
                                    ? [detail.education?.major, detail.education?.name].filter((e) => e).join(' tại ')
                                    : 'Không có thông tin'
                            }}
                        </div>
                        <div class="form-item col-6" v-else>
                            <BaseInputText
                                v-model:value="updateDetailForm.education.name"
                                label="Trường học"
                                placeholder="Trường học"
                                :error="translateYupError(updateDetailForm.errors['education.name'] as IYupError)"
                            />
                            <BaseInputText
                                v-model:value="updateDetailForm.education.major"
                                label="Chuyên ngành"
                                placeholder="Chuyên ngành"
                                :error="translateYupError(updateDetailForm.errors['education.major'] as IYupError)"
                            />
                        </div>
                    </div>
                </div>
                <BaseDivider />
                <div class="section overview">
                    <div class="header">Trạng thái tài khoản</div>
                    <div class="content">
                        <div class="content-row">
                            <div class="title col-4">Trạng thái</div>
                            <div class="value col-6" v-if="!isEditing">
                                {{ profile?.private ? `Riêng tư` : `Công khai` }}
                            </div>
                            <div class="form-item col-6" v-else>
                                <BaseSingleSelect
                                    v-model:value="updateDetailForm.isPrivate"
                                    :options="privacyOptions"
                                    :error="translateYupError(updateDetailForm.errors.private as IYupError)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <BaseDivider />
                <div class="section favorites">
                    <div class="header">Sở thích</div>
                    <div class="content-row">
                        <div class="title col-4">Sở thích</div>
                        <div class="value col-6" v-if="!isEditing">
                            <div class="tag-item" v-for="tag in userTags" :key="tag._id">
                                <img :src="getImageSourceById(tag.iconId)" width="24" height="24" />
                                {{ tag.name }}
                            </div>
                        </div>
                        <div class="form-item col-6" v-else>
                            <BaseMultipleSelect
                                v-model:value="updateDetailForm.tagIds"
                                :filterable="true"
                                :isCustomOption="true"
                                :error="translateYupError(updateDetailForm.errors.tagIds as IYupError)"
                                :limit="5"
                                :maxCollapseTags="5"
                            >
                                <template #options>
                                    <div v-for="option in tags" :key="option._id">
                                        <el-option
                                            :label="option.name"
                                            :value="option._id"
                                            :id="`option_${option._id}`"
                                            :style="optionStyle"
                                        >
                                            <div class="d-flex flex-row align-items-center">
                                                <img
                                                    :src="getImageSourceById(option.iconId)"
                                                    class="me-2"
                                                    width="24"
                                                    height="24"
                                                />
                                                {{ option.name }}
                                            </div>
                                        </el-option>
                                    </div>
                                </template>
                            </BaseMultipleSelect>
                        </div>
                    </div>
                </div>
                <BaseDivider />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Gender, GenderName, Relationship, RelationshipName } from '@/common/constants';
import { IAddress, IEducation, IWork, IYupError } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import userApiService from '@/common/service/user.api.service';
import { appModule } from '@/plugins/vuex/appModule';
import yup from '@/plugins/yup';
import { useField, useForm } from 'vee-validate';
import { Options, setup } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import z from 'zodiac-signs';
import { profileModule } from '../../store';

@Options({
    components: {},
})
export default class DescribeScreen extends GlobalMixin {
    Gender = Gender;
    Relationship = Relationship;
    GenderName = GenderName;
    RelationshipName = RelationshipName;

    get zodiac() {
        return z().getSignByDate({
            day: this.parseDateTime(this.detail.birthday, 'D'),
            month: this.parseDateTime(this.detail.birthday, 'M'),
        });
    }

    isEditing = false;

    get genderOptions() {
        return Object.values(Gender).map((gender) => {
            return {
                id: gender,
                name: GenderName[gender],
            };
        });
    }

    get relationshipOptions() {
        return Object.values(Relationship).map((relationship) => {
            return {
                id: relationship,
                name: RelationshipName[relationship],
            };
        });
    }

    get privacyOptions() {
        return [
            {
                id: true,
                name: 'Riêng tư. Những người không theo dõi bạn sẽ không xem được tường nhà bạn.',
            },
            {
                id: false,
                name: 'Công khai. Những người không theo dõi bạn có thể xem được tường nhà bạn.',
            },
        ];
    }

    get userId() {
        return this.$route.params.id as string;
    }

    get profile() {
        return profileModule.profileUser;
    }

    get loginUser() {
        return appModule.loginUser;
    }

    get isUser() {
        return this.loginUser._id == this.userId;
    }

    get detail() {
        return profileModule.profileDetail;
    }

    get tags() {
        return appModule.tags || [];
    }

    get userTags() {
        return this.tags.filter((tag) => this.detail.tagIds?.includes(tag._id));
    }
    optionStyle: Record<string, string> = {
        whiteSpace: 'normal',
        overflow: 'visible',
        textOverflow: 'unset',
        height: 'auto',
    };

    mounted(): void {
        this.updateDetailForm.setValues({
            ...this.detail,
            private: this.profile?.private,
        });
    }

    @Watch('detail', { immediate: true, deep: true })
    updateForm() {
        this.updateDetailForm.setValues({
            ...this.detail,
            private: this.profile?.private,
        });
    }

    updateDetailForm = setup(() => {
        const initValues = {
            gender: Gender.OTHER,
            birthday: undefined as unknown as Date,
            address: {} as IAddress,
            relationship: Relationship.SINGLE,
            work: {} as IWork,
            education: {} as IEducation,
            tagIds: [] as string[],
            private: undefined as unknown as boolean,
        };

        const schema = yup.object({
            gender: yup.string(),
            birthday: yup.date(),
            address: yup.object(),
            relationship: yup.string(),
            work: yup.object(),
            education: yup.object(),
            tags: yup.array(),
            private: yup.bool(),
        });

        const { resetForm, setValues, errors, handleSubmit } = useForm({
            validationSchema: schema,
            initialValues: initValues,
        });

        const clearFormData = () => {
            resetForm({
                values: {
                    ...initValues,
                },
            });
        };

        const submit = handleSubmit(async (values) => {
            const { gender, birthday, address, relationship, work, education, tagIds, private: isPrivate } = values;
            const response = await userApiService.updateProfile({
                gender,
                birthday,
                address,
                relationship,
                work,
                education,
                tagIds,
                private: isPrivate,
            });
            if (response.success) {
                this.isEditing = !this.isEditing;
                Object.assign(this.detail, values);
                if (this.profile) {
                    this.profile.private = values.private;
                }
                this.showSuccessNotificationFunction('Cập nhật thành công.');
            } else {
                this.showErrorNotificationFunction(response?.message || 'Cập nhật thất bại');
            }
        });

        const { value: gender } = useField<Gender>('gender');
        const { value: birthday } = useField<Date>('birthday');
        const { value: address } = useField<IAddress>('address');
        const { value: relationship } = useField<Relationship>('relationship');
        const { value: work } = useField<IWork>('work');
        const { value: education } = useField<IEducation>('education');
        const { value: tagIds } = useField<string[]>('tagIds');
        const { value: isPrivate } = useField<boolean[]>('private');

        return {
            gender,
            birthday,
            address,
            relationship,
            work,
            education,
            tagIds,
            isPrivate,
            errors,
            submit,
            clearFormData,
            setValues,
        };
    });

    async onSubmit() {
        await this.updateDetailForm.submit();
    }

    async onCancel() {
        this.updateDetailForm.setValues(this.detail);
        this.isEditing = !this.isEditing;
    }
}
</script>

<style lang="scss" scoped>
.describe-screen-wrapper {
    margin-bottom: 8px;
}
.describe-screen-container {
    background: $color-white;
    border-radius: 8px;
    padding: 16px;

    .page-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: baseline;

        .page-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 24px;
        }
    }

    .content {
        .section {
            .header {
                font-weight: 500;
                font-size: 18px;
            }
        }
    }

    .content-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        .value {
            font-weight: 500;
        }
    }

    .section.favorites {
        .tag-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 8px;
        }
    }
}
</style>
