<template>
    <div class="image-grid-wrapper" v-if="images.length" :style="style">
        <div class="grid" :class="[css, images.length > cells ? 'grid-' + cells : 'grid-' + images.length]">
            <div v-for="(media, i) in images" :key="i" class="item" :style="bg(media)">
                <span v-if="i < cells">
                    <span v-if="i === cells - 1 && images.length - cells > 0" class="more">
                        {{ images.length - cells }}+
                    </span>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({
    components: {},
})
export default class ImageGrid extends GlobalMixin {
    @Prop({ default: [] }) items!: string[];
    @Prop({ default: 'h-250 h-md-400 h-lg-600' }) css!: string;
    @Prop({ default: 5 }) cells!: number;
    @Prop({ default: 200 }) height!: number;

    get style() {
        return {
            height: this.height + `px`,
        };
    }

    get images() {
        return this.items.map((id) => this.getImageSourceById(id));
    }

    bg(url: string) {
        const convertUrl = url;
        return convertUrl && convertUrl.length > 0 ? `background-image: url('${convertUrl}')` : '';
    }
}
</script>

<style lang="scss" scoped>
.grid {
    position: relative;
    display: block;
    cursor: pointer;
    background: #000000;
    height: 100%;
}

.item {
    position: absolute;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    border-top: solid 2px #fff;
    border-right: solid 2px #fff;
    overflow: hidden;
}

.grid-1 .item {
    width: 100%;
    height: 100%;
}

.grid-2 .item,
.grid-3 .item,
.grid-4 .item,
.grid-5 .item {
    width: 50%;
}

.grid-2 .item,
.grid-3 .item:nth-child(1),
.grid-4 .item:nth-child(1) {
    height: 100%;
}

.grid-3 .item:nth-child(2),
.grid-3 .item:nth-child(3),
.grid-5 .item:nth-child(1),
.grid-5 .item:nth-child(2) {
    height: 50%;
}

.item:last-child,
.grid-2 .item:nth-child(2),
.grid-3 .item:nth-child(2),
.grid-3 .item:nth-child(3),
.grid-4 .item:nth-child(2),
.grid-4 .item:nth-child(3),
.grid-4 .item:nth-child(4),
.grid-5 .item:nth-child(3),
.grid-5 .item:nth-child(4),
.grid-5 .item:nth-child(5) {
    left: auto;
    right: 0;
    border-right: 0;
}

.grid-3 .item:nth-child(3),
.grid-4 .item:nth-child(4),
.grid-5 .item:nth-child(2),
.grid-5 .item:nth-child(5) {
    bottom: 0;
    top: auto;
}

.grid-4 .item:nth-child(3),
.grid-5 .item:nth-child(4) {
    top: 33.333333333333336%;
}

.grid-4 .item:nth-child(2),
.grid-4 .item:nth-child(3),
.grid-4 .item:nth-child(4),
.grid-5 .item:nth-child(3),
.grid-5 .item:nth-child(4),
.grid-5 .item:nth-child(5) {
    height: 33.333333333333336%;
}

.more {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #fff;
    font-size: 3rem;
    background-color: rgba(0, 0, 0, 0.4);
}

.more:before {
    display: inline-block;
    content: '';
    vertical-align: middle;
    height: 100%;
}
</style>
