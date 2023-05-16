<template>
    <div class="group-detail-header-wrapper">
        <div class="cover">
            <img v-if="group?.coverId" :src="getImageSourceById(group?.coverId)" alt="" />
        </div>

        <div class="overview">
            <div class="name">
                {{ group?.name }}
            </div>
            <div class="members">{{ group?.memberIds?.length || 0 }} thành viên</div>
        </div>

        <div class="footer">
            <div class="menu">
                <GroupDetailMenu />
            </div>
            <div class="action">
                <GroupDetailAction />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { IGroup } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { groupDetailModule } from '../store';
import GroupDetailAction from './GroupDetailAction.vue';
import GroupDetailMenu from './GroupDetailMenu.vue';

@Options({
    components: {
        GroupDetailMenu,
        GroupDetailAction,
    },
})
export default class GroupDetailHeader extends GlobalMixin {
    get group() {
        return groupDetailModule.groupDetail || ({} as IGroup);
    }
}
</script>

<style lang="scss" scoped>
.group-detail-header-wrapper {
    border-radius: 6px;
    background: $color-white;

    .cover {
        height: 300px;
        background: $color-gray-4;
        margin-top: 8px;
        position: relative;
        border-radius: 8px 8px 0 0;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px 8px 0 0;
        }
    }

    .overview {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;

        .name {
            font-size: 24px;
            font-weight: 700;
        }
    }

    .footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        .menu {
            width: 50%;
        }

        .action {
            width: 50%;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
        }
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, sm)) {
    .group-detail-header-wrapper {
        .footer {
            .menu {
                width: 0;
            }
        }
    }
}
</style>
