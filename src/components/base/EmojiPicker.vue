<template>
    <div class="emoji-picker-wrapper">
        <div class="emoji-button" @click="openEmojiPicker">
            <el-icon :size="20"><Compass /></el-icon>
        </div>

        <div class="emoji-picker-container" v-if="isShowEmojiPicker" v-click-away="onClickAway">
            <div class="emoji-picker">
                <div class="emoji-list">
                    <div class="category" v-for="category in categories" :key="`category_${category}`">
                        <span>{{ category }}</span>
                        <div class="emoji-items">
                            <button
                                @click="onEmojiClick($event, emoji)"
                                v-for="(emoji, index) in emojisByCategory(category)"
                                :key="`emoji_${index}`"
                            >
                                {{ emoji }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import data from '@/assets/json/emojis.json';
import { GlobalMixin } from '@/common/mixins';
import { Options } from 'vue-class-component';

@Options({})
export default class EmojiPicker extends GlobalMixin {
    isShowEmojiPicker = false;

    get categories() {
        return Object.keys(data);
    }

    get emojisByCategory() {
        return (category: string): string[] => {
            return Object.values(data[category]);
        };
    }

    openEmojiPicker() {
        this.isShowEmojiPicker = !this.isShowEmojiPicker;
    }

    onEmojiClick(e: Event, emoji: string) {
        e.preventDefault();
        this.$emit(`on-pick-emoji`, emoji);
    }

    onClickAway() {
        this.isShowEmojiPicker = false;
    }
}
</script>

<style lang="scss" scoped>
.emoji-button {
    cursor: pointer;
}
.emoji-picker-container {
    position: absolute;
    bottom: 100%;
    right: 0;
}
.emoji-picker {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 20rem;
    height: 20rem;
    max-width: 100%;
}

.emoji_picker,
.bottom_arrow {
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.0975);
}

.emoji_picker,
.emoji-list {
    border-radius: 0.5rem;
    background: white;
}

.emoji-list {
    position: relative;
    padding: 1rem;
    overflow: auto;
    z-index: 1;
}

.category {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    color: rgb(169, 169, 169);
}

.emoji-items {
    display: flex;
    flex-wrap: wrap;
}

.category button {
    margin: 0.5rem;
    margin-left: 0;
    background: inherit;
    border: none;
    font-size: 1.75rem;
    padding: 0;
}
</style>
