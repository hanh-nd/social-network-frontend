<template>
    <div class="group-card-wrapper" @click="goToGroupDetailPage">
        <div class="avatar">
            <img :src="getImageSourceById(group?.coverId)" />
        </div>
        <div class="information">
            <div class="name">
                {{ group?.name }}
            </div>
            <div class="member">{{ group?.memberIds?.length }} thành viên.</div>
        </div>
    </div>
</template>

<script lang="ts">
import { IGroup } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class GroupCard extends GlobalMixin {
    @Prop() group!: IGroup;

    goToGroupDetailPage() {
        this.$router.push({
            name: this.PageName.GROUP_DETAIL_PAGE,
            params: {
                id: this.group._id,
            },
        });
    }
}
</script>

<style lang="scss">
.group-card-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    .avatar {
        width: 30px;

        img {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-radius: 8px;
        }
    }

    .information {
        display: flex;
        flex-direction: column;

        .name {
            font-weight: 500;
        }

        .extra-info {
            display: flex;
            flex-direction: row;
            gap: 2px;
        }
    }
}
</style>
