<template>
  <div>
    <el-input v-model="post.title" placeholder="제목을 입력해주세요"/>
  </div>

  <div class="mt-2">
    <el-input v-model="post.content" type="textarea" rows="15"></el-input>
  </div>

  <div class="mt-2">
    <el-button type="warning" @click="edit()">수정 완료</el-button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {storeToRefs} from "pinia";

const post = ref({
  id: 0,
  title: "",
  content: ""
});

const router = useRouter();
const auth = useAuthStore();
const {getAccessToken} = storeToRefs(auth)
const configs = {
  headers: {
    Authorization: getAccessToken.value
  }
}


const props = defineProps({
  postId: {
    type: [Number, String],
    require: true
  }
})

axios.get(`/api/posts/${props.postId}`, configs).then((response) => {
  post.value = response.data;
})

const edit = function () {
  axios.patch(`/api/posts/${props.postId}`, post.value, configs)
      .then((r) => {
        router.replace({name: 'posts'})
      }).catch(e => {
        auth.clear();
        router.replace({name: "login"})
  })
};
</script>