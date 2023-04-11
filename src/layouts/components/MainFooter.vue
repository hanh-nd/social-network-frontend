<template>
    <div class="footer">
        <div class="footer-wrapper">
            <div class="footer-container mx-auto"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
    components: {},
})
export default class MainFooter extends Vue {}
</script>
<style lang="scss" scoped>
.footer {
    font-family: 'Roboto';
}

.footer-wrapper {
    background-color: $color-pink-light;
}

.footer-container {
    max-width: $content-max-width + $content-padding * 2;
    padding: 0 $content-padding;
    height: 260px;
}
</style>
