<template>
  <div class="container">
    <div class="mt-2">
      <h3>이메일</h3>
      <p id="email"> {{ errorResponse.email }} </p>
      <el-input v-model="email" placeholder="이메일을 입력해주세요."/>
    </div>

    <div class="mt-2">
      <h3>비밀번호</h3>
      <p id="password"> {{ errorResponse.password }} </p>
      <el-input v-model="password"
                type="password"
                rows="15"
                placeholder="숫자, 문자, 특수문자 포함 8~15자리 이내로 입력해주세요."
      />
    </div>

    <div class="mt-2">
      <h3>닉네임</h3>
      <p id="name">{{ errorResponse.nickname }}</p>
      <el-input v-model="nickname" rows="15" placeholder="닉네임을 입력해주세요."></el-input>
    </div>
    <div class="mt-2 float-end">
      <el-button type="primary" @click="join()">회원가입</el-button>
    </div>

    <div class="mt-3">
      <el-button link @click="getKakaoCode"
         type="primary">
       카카오 회원가입
      </el-button>
    </div>

  </div>
</template>

<script setup lang="ts">

import {computed, ref, watch} from "vue";
import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter();
const email = ref('');
const nickname = ref('');
const password = ref('');

const errorResponse = ref({
  email: '',
  nickname: ''
})

const join = function () {

  axios.post('/api/members/join', {
    email: email.value,
    password: password.value,
    nickname: nickname.value,
  })
      .then((r) => {
        if (r.status == 200) {
          router.replace({name: "home"});
        }
      })
      .catch((e) => {
        errorResponse.value = {email: '', nickname: ''};
        errorResponse.value = e.response.data.validation;
      })
}

const getKakaoCode = function () {
  location.href = `https://kauth.kakao.com/oauth/authorize?redirect_uri=${import.meta.env.VITE_KAKAO_JOIN_REDIRECT_URI}&response_type=code&client_id=${import.meta.env.VITE_KAKAO_LOGIN_CLIENT_ID}`;
};

watch(async () => {
  const getAccesstoken = async (authorizationCode: any) => {

    axios.get(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&code=${authorizationCode}&client_id=${import.meta.env.VITE_KAKAO_LOGIN_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_JOIN_REDIRECT_URI}&client_secret=${import.meta.env.VITE_KAKAO_LOGIN_CLIENT_SECRET}`)
        .then(res => {
          axios.post("https://kapi.kakao.com/v2/user/me", null, {
            headers: {
              "Authorization": "Bearer " + res.data.access_token,
              "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
            }
          })
              .then(res => {
                axios.post('/api/members/join', {
                  email: res.data.kakao_account.email,
                  nickname: res.data.properties.nickname,
                  auth: "kakao"
                })
                    .then(res => {
                      if (res.status == 200) {
                        alert("회원 가입에 성공하였습니다!");
                        router.push({name: 'home'});
                      }
                    })
                    .catch(err => {
                      alert(err.response.data.message);
                    })
              })
              .catch(err => {
                alert("오류가 있습니다. 다시 시도해주세요");
              })
        })
        .catch(err => {
          alert(err);
        })
  }

  const authorizationCode = new URL(window.location.href).searchParams.get("code");
  if (authorizationCode) {
    await getAccesstoken(authorizationCode);
  }
}, () => {
})


</script>

<style scoped>
p {
  color: red;
  font-size: 0.8rem;
}

.container {
  width: 500px;
}
</style>