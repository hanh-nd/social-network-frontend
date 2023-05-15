<template>
    <div class="group-grid-card-wrapper" @click="goToGroupDetailPage">
        <div class="cover">
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
export default class GroupGridCard extends GlobalMixin {
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
.group-grid-card-wrapper {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    background: $color-white;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;

    .cover {
        width: 100%;
        height: 150px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .information {
        display: flex;
        flex-direction: column;
        flex: 1;
        justify-content: flex-end;

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
