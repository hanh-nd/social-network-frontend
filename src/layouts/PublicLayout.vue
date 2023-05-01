<template>
    <div class="public-layout">
        <div class="app-content">
            <router-view v-slot="{ Component }" :key="`${new Date()}`">
                <component :is="Component" />
            </router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class PublicLayout extends Vue {
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
.public-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.app-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
