import i18n from '@/plugins/vue-i18n';
import { appModule } from '@/plugins/vuex/appModule';
import { ElNotification } from 'element-plus';
import moment from 'moment';
import { Vue } from 'vue-class-component';
import localStorageAuthService from './authStorage';
import { DEFAULT_LANGUAGE, DateFormat, DeviceType, PageName, ReactionType, ValidationForm } from './constants';
import { IUser, IYupError } from './interfaces';

export class GlobalMixin extends Vue {
    // constants
    DateFormat = DateFormat;
    PageName = PageName;
    DeviceType = DeviceType;
    ValidationForm = ValidationForm;

    get loginUser() {
        return appModule.loginUser;
    }

    get roles() {
        return appModule.roles;
    }

    //
    parseDateTime(dateTime: Date | string | undefined, dateTimeFormat: string, language = DEFAULT_LANGUAGE): string {
        if (!moment(dateTime).isValid) {
            return '';
        }
        return moment(dateTime).locale(language).format(dateTimeFormat);
    }

    //
    parseDateTimeRelative(dateTime: Date | string | undefined, language = DEFAULT_LANGUAGE): string {
        if (!moment(dateTime).isValid) {
            return '';
        }
        const date = moment(dateTime).locale(language);
        if (moment().diff(date, 'years') > 1) {
            return date.format(DateFormat.DD_vi_MM_YYYY_HH_mm);
        } else if (moment().diff(date, 'days') > 1) {
            return date.format(DateFormat.DD_vi_MM_HH_mm);
        }
        return date.fromNow(true);
    }

    translateYupError(yupError: IYupError): string {
        if (!yupError) return '';
        if ((yupError as IYupError)?.i18nKey)
            return this.$t((yupError as IYupError)?.i18nKey as string, {
                ...((yupError as IYupError)?.params as Record<string, string>),
            });
        return this.$t(yupError as string);
    }

    showSuccessNotificationFunction(message: string, title?: string): void {
        ElNotification({
            type: 'success',
            title: title || (i18n.global.t('app.notification') as string),
            message: message,
        });
    }

    showErrorNotificationFunction(message: string, title?: string): void {
        ElNotification({
            type: 'error',
            title: title || (i18n.global.t('app.notification') as string),
            message: message,
        });
    }

    parsePrice(price: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'decimal',
            currency: 'VND',
        }).format(Number(price));
    }

    removeAccents(str: string): string {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    vietnameseStringInclude(str: string, keyword: string): boolean {
        if (!str || !keyword) return false;
        return this.removeAccents(str.toLowerCase()).includes(this.removeAccents(keyword.toLowerCase()));
    }

    vietnameseStringStartsWith(str: string, keyword: string): boolean {
        return this.removeAccents(str.toLowerCase()).startsWith(this.removeAccents(keyword.toLowerCase()));
    }

    removeTextBeforeSubstring(str: string, substr: string): string {
        if (
            !this.vietnameseStringInclude(
                this.removeAccents(str).toLowerCase(),
                this.removeAccents(substr).toLowerCase(),
            )
        ) {
            return '';
        }

        if (
            this.vietnameseStringStartsWith(
                this.removeAccents(str).toLowerCase(),
                this.removeAccents(substr).toLowerCase(),
            )
        ) {
            return str;
        }
        return (
            '...' +
            str
                .toLowerCase()
                .substring(
                    str.lastIndexOf(
                        ' ',
                        this.removeAccents(str).toLowerCase().indexOf(this.removeAccents(substr).toLowerCase()),
                    ) + 1,
                )
        );
    }

    getImageSourceById(id: string) {
        return `${process.env.VUE_APP_API_URL}/files/${id}`;
    }

    isLoginUser(user: Partial<IUser> | null) {
        if (!user?._id) return false;

        return user?._id === localStorageAuthService.getLoginUser()._id;
    }

    get isModerator() {
        if (!this.loginUser?.roleId) return false;

        return this.roles.filter((role) => role.name !== 'User').find((r) => r._id == this.loginUser.roleId);
    }

    get isSystemAdmin() {
        if (!this.loginUser?.roleId) return false;

        return this.roles.filter((role) => role.name === 'Admin').find((r) => r._id == this.loginUser.roleId);
    }

    getAvatarUrl(user?: Partial<IUser>) {
        return user?.avatarId
            ? `${process.env.VUE_APP_API_URL}/files/${user.avatarId}`
            : require('@/assets/images/common/default-avatar.svg');
    }

    getReactionTypeString(reactionType?: ReactionType) {
        switch (reactionType) {
            case ReactionType.LIKE:
                return `Thích`;
            case ReactionType.LOVE:
                return `Yêu thích`;
            case ReactionType.EMPATHIZE:
                return `Đồng cảm`;
            case ReactionType.CELEBRATE:
                return `Chúc mừng`;
            case ReactionType.ANGRY:
                return `Giận dữ`;
        }

        return ``;
    }
}
