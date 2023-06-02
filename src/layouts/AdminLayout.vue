<template>
    <div class="admin-layout">
        <MainHeader />

        <div class="app-content">
            <div class="menu">
                <AdminMenu />
            </div>
            <div class="content">
                <router-view v-slot="{ Component }" :key="`${new Date()}`">
                    <component :is="Component" class="h-100" />
                </router-view>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import MainHeader from './components/MainHeader.vue';
import AdminMenu from './components/admin-menu/AdminMenu.vue';

@Options({
    components: {
        MainHeader,
        AdminMenu,
    },
})
export default class AdminLayout extends Vue {
    created() {
        this.loadData();
    }

    loadData() {
        //
    }
}
</script>
<style lang="scss" scoped>
body {
    padding-right: 0;
}
.admin-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 16px;
    background-color: $color-gray;
}

.app-content {
    min-height: 100vh;
    display: flex;
    flex-direction: row;
    gap: 16px;

    .menu {
        width: 200px;
    }

    .content {
        width: calc(100% - 200px);
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: $color-white;
        border-radius: 8px;
    }
}

@media only screen and (max-width: map-get($grid-breakpoints, md)) {
    .app-content {
        .menu {
            width: 66px;
        }
    }
}
</style>
