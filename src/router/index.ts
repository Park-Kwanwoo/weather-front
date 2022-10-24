import { createRouter, createWebHistory } from 'vue-router'
import PostListView from '@/views/post/PostListView.vue'
import PostWriteView from '@/views/post/PostWriteView.vue'
import PostView from '@/views/post/PostView.vue'
import PostEditView from '@/views/post/PostEditView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/user/LoginView.vue'
import JoinView from '@/views/user/JoinView.vue'
import MyPageView from '@/views/user/MyPageView.vue'
import MyPageEditView from '@/views/user/MyPageEditView.vue'
import PasswordEditView from '@/views/user/PasswordEditView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostListView
    },
    {
      path: '/post/write',
      name: 'write',
      component: PostWriteView
    },
    {
      path: '/post/:postId',
      name: "post",
      component: PostView,
      props: true,
    },
    {
      path: "/post/edit/:postId",
      name: "edit",
      component: PostEditView,
      props: true,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      props: true
    },
    {
      path: '/join',
      name: 'join',
      component: JoinView,
      props: true
    },
    {
      path: '/myPage/:memberId',
      name: 'myPage',
      component: MyPageView,
      props: true
    },
    {
      path: '/myPageEdit/:memberId',
      name: 'myPageEdit',
      component: MyPageEditView,
      props: true
    },
    {
      path: '/passwordEdit/:memberId',
      name: 'password',
      component: PasswordEditView,
      props: true
    }
  ]
})

export default router
