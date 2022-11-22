<template>
  <div class="container">
    <div>
      <el-form
          label-width="120px"
          class="demo-dynamic"
          :model="loginData">
        <el-form-item
            prop="email"
            label="email"
            :rules="[
        { required: true, message: 'Please input email', trigger: 'blur' },
      ]">
          <el-input name="email" v-model="loginData.email" type="text"/>
        </el-form-item>
        <el-form-item
            prop="password"
            label="password"
            :rules="[
        { required: true, message: 'Please input password', trigger: 'blur' },
      ]">
          <el-input name="password" v-model="loginData.password" type="password"/>
        </el-form-item>
        <el-form-item>
          <el-button id="homeLoginBtn" type="plain" round v-on:click.prevent="homeLogin" class="btn-primary">로그인</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="float-end">
      <el-button id="kakaoLoginBtn" round @click="kakaoLogin">
        카카오 로그인
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import {reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import {ElMessage} from "element-plus";

const router = useRouter();
const auth = useAuthStore();

const loginData = reactive({
  email: '',
  password: '',
  auth: '',
})

const configs = {
  headers: {
    "X-Requested-With": "XMLHttpRequest"
  }
}

const homeLogin = () => {

  axios.post("/api/members/login", loginData, configs)
      .then((res) => {
        auth.setAuth(true)
        auth.setAccessToken(r.data.token);
        auth.setId(res.data.id);
        router.replace({name: 'home'});
      })
      .catch(err => {
        ElMessage(err.response.data)
      });
}

const kakaoLogin = function () {
  location.href = `https://kauth.kakao.com/oauth/authorize?redirect_uri=${import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI}&response_type=code&client_id=${import.meta.env.VITE_KAKAO_LOGIN_CLIENT_ID}`;
};

watch(async () => {
      const getAccesstoken = async (authorizationCode: any) => {

        axios.get(`https://kauth.kakao.com/oauth/token?grant_type=authorization_code&code=${authorizationCode}&client_id=${import.meta.env.VITE_KAKAO_LOGIN_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_KAKAO_LOGIN_REDIRECT_URI}&client_secret=${import.meta.env.VITE_KAKAO_LOGIN_CLIENT_SECRET}`)
            .then(res => {
              axios.post("https://kapi.kakao.com/v2/user/me", null, {
                headers: {
                  "Authorization": "Bearer " + res.data.access_token,
                  "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
                }
              })
                  .then(res => {
                    axios.post('/api/members/login', {
                      email: res.data.kakao_account.email,
                      auth: "kakao"
                    }, configs)
                        .then((res) => {
                          auth.setAuth(true)
                          auth.setAccessToken(res.data.token);
                          auth.setId(res.data.id);
                          router.replace({name: 'home'});
                        })
                        .catch(err => {
                          ElMessage(err.response.data.validation.email);
                        });
                  })
                  .catch(() => {
                    alert("오류가 있습니다. 다시 시도해주세요");
                  })
            })
            .catch(err => {
              alert("오류가 있습니다. 다시 시도해주세요");
            })
      }

      const authorizationCode = new URL(window.location.href).searchParams.get("code");
      if (authorizationCode) {
        await getAccesstoken(authorizationCode);
      }
    }, () => {
    }
)
</script>

<style scoped>
.container {
  width: 500px;
}

#kakaoLoginBtn {
  border: rgb(254, 229, 0);
  background-color: rgb(254, 229, 0);
  width: 380px;
}

#homeLoginBtn {
  width: 400px;
}
</style>