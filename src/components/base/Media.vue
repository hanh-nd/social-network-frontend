<template>
    <div class="media-wrapper">
        <div class="image" v-if="isImage" loading="lazy">
            <img :src="url" />
        </div>

        <div class="video" v-else>
            <vue-plyr>
                <video
                    controls
                    crossorigin="true"
                    playsinline
                    :data-poster="require('@/assets/images/common/video_placeholder.png')"
                >
                    <source :src="url" type="video/mp4" />
                </video>
            </vue-plyr>
        </div>
    </div>
</template>

<script lang="ts">
import { IFile } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Options({})
export default class Media extends GlobalMixin {
    @Prop() media!: IFile;

    get isImage() {
        return this.media.contentType.match(/^image/);
    }

    get url() {
        return this.getImageSourceById(this.media._id);
    }
}
</script>

<style lang="scss" scoped>
.media-wrapper {
    --plyr-color-main: #79bf43;

    img {
        width: 100%;
        object-fit: cover;
    }
}
</style>
