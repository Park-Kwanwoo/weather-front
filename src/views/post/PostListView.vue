<template>
  <div>
    <h1>자유 게시판</h1>
  </div>
  <div class="el-form-item">
    <el-table :data="posts" :height="440">
      <el-table-column prop="id" width="100" label="번호"/>
      <el-table-column prop="title" label="제목">
        <template v-slot:default="table">
          <router-link :to="{name: 'post', params: { postId: table.row.id }}" tag="span">
            {{ table.row.title }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="memberName" label="작성자" width="150px"/>
      <el-table-column prop="createdTime" label="작성일" width="150px"/>
    </el-table>
  </div>
  <div>
    <el-button type="primary" @click="write">글 작성</el-button>
  </div>
  <div class="pagination" >
    <el-pagination
        style="justify-content: center"
        small
        background
        layout="prev, pager, next"
        :total="total()"
        @next-click="pagination"
        @prev-click="pagination"
        @current-change="pagination"
        class="mt-4"
    />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {ref} from "vue";
import {useAuthStore} from "@/stores/auth";
import {storeToRefs} from "pinia";
import router from "@/router";
import {ElMessage} from "element-plus";

const auth = useAuthStore();
const posts = ref([])
const totalPage = ref(0);
const { isAuth } = storeToRefs(auth)


axios.get("/api/posts/totalPage")
    .then(r => {
      totalPage.value = r.data;
    }).catch(e => {
      ElMessage(e.response.data)
})


axios.get("/api/posts")
    .then(r => {
      r.data.forEach((res: any) => {
        posts.value.push(res);
      })
    })
    .catch(e => {
      ElMessage(e.response.data)
      auth.clear();
      router.push({name: 'home'});
    })

const write = function () {
  if (isAuth.value) {
    router.push( {name: 'write'} )
  } else {
    router.push({name: 'login'})
  }

};

const total = function () {
  return totalPage.value > 10 ? totalPage.value : 10;
};


</script>
