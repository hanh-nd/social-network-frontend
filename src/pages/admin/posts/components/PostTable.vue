<template>
    <div class="post-table">
        <div class="action">
            <el-button>
                <el-icon :size="20" @click.prevent="bulkDeleteSelectedPosts()"><Delete /></el-icon>
            </el-button>
            <el-button :disabled="currentPage === 1" @click="onPrev">Trang trước</el-button>
            <el-button :disabled="isFetchedAllPostList" @click="onNext">Trang sau</el-button>
        </div>
        <el-table
            :data="postList"
            stripe
            style="width: 100%"
            ref="multipleTableRef"
            cell-class-name="cell-item"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="55" />

            <el-table-column prop="_id" label="Mã bài viết" />
            <el-table-column prop="author.fullName" label="Tác giả" />
            <el-table-column prop="content" label="Nội dung" />
            <el-table-column label="Thời gian tạo">
                <template #default="scope">
                    {{ parseDateTime(scope.row.createdAt, DateFormat.DD_vi_MM_YYYY_HH_mm) }}
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái">
                <template #default="scope">
                    <el-tag :type="scope.row.deletedAt ? 'danger' : 'default'">{{
                        scope.row.deletedAt ? 'Đã xóa' : 'Hoạt động'
                    }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="Operations" width="120">
                <template #default="scope">
                    <el-icon :size="20" style="cursor: pointer" @click.prevent="deletePost(scope.row)"
                        ><Delete
                    /></el-icon>
                    <el-icon :size="20" style="cursor: pointer" @click.prevent="getDetail(scope.row)"><Edit /></el-icon>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script lang="ts">
import { IPost } from '@/common/interfaces';
import { GlobalMixin } from '@/common/mixins';
import adminPostApiService from '@/common/service/admin.post.api.service';
import { Options } from 'vue-class-component';
import { adminPostModule } from '../store';

@Options({
    components: {},
})
export default class PostTable extends GlobalMixin {
    get postList() {
        return adminPostModule.postList;
    }

    selectedPosts: IPost[] = [];

    get currentPage() {
        return adminPostModule.postListQuery.page as number;
    }

    get isFetchedAllPostList() {
        return adminPostModule.isFetchedAllPostList;
    }

    handleSelectionChange(posts: IPost[]) {
        this.selectedPosts = posts;
    }

    async bulkDeleteSelectedPosts() {
        const response = await adminPostApiService.bulkDeletePost({
            ids: this.selectedPosts.filter((p) => !p.deletedAt).map((p) => p._id),
        });
        if (response?.success) {
            for (const p of this.selectedPosts) {
                p.deletedAt = new Date();
            }
            (this.$refs.multipleTableRef as any).clearSelection();
        }
    }

    async deletePost(post: IPost) {
        const response = await adminPostApiService.bulkDeletePost({
            ids: [post._id],
        });
        if (response?.success) {
            post.deletedAt = new Date();
        }
    }

    onPrev() {
        if (this.currentPage > 1 && this.isFetchedAllPostList) {
            adminPostModule.setIsFetchedAllPostList(false);
        }
        adminPostModule.setPostListQuery({
            page: this.currentPage - 1,
        });
        adminPostModule.getPostList();
    }

    onNext() {
        adminPostModule.setPostListQuery({
            page: this.currentPage + 1,
        });
        adminPostModule.getPostList();
    }

    getDetail(post: IPost) {
        this.$router.push({
            name: this.PageName.POST_DETAIL_PAGE,
            params: {
                id: post._id,
            },
        });
    }
}
</script>

<style lang="scss" scoped>
:deep(.el-table__row) {
    .cell-item {
        .cell {
            max-height: 60px;
        }
    }
}
</style>
