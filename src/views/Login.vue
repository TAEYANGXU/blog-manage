<template>
  <div class="login-container">
    <!-- 左侧背景区域 -->
    <div class="left-section">
      <div class="logo-section">
        <el-icon class="logo-icon">
          <Monitor />
        </el-icon>
        <span class="logo-text">个人博客管理系统</span>
      </div>

      <div class="tagline">
        <span>智能 · 高效 · 专业</span>
      </div>

      <div class="floating-cubes">
        <div class="cube cube-1"></div>
        <div class="cube cube-2"></div>
        <div class="cube cube-3"></div>
        <div class="cube cube-4"></div>
        <div class="cube cube-5"></div>
        <div class="cube cube-6"></div>
      </div>

      <div class="bottom-text">
        <!-- <h2>让企业管理更简单</h2> -->
        <h3>更高效</h3>
        <p>提供一站式企业管理解决方案</p>
        <p>助力企业数字化转型</p>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="right-section">
      <div class="login-form-container">
        <h2 class="login-title">欢迎登录</h2>
        <p class="login-subtitle">请输入您的账号和密码</p>

        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              size="large"
              :prefix-icon="User"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              size="large"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>

          <div class="form-options">
            <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
            <el-button type="text" class="forgot-password">忘记密码?</el-button>
          </div>

          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loginLoading"
            @click="handleLogin"
          >
            登录
          </el-button>

          <!-- <div class="other-login">
            <span>其他登录方式</span>
            <div class="login-methods">
              <el-button circle :icon="ChatDotSquare" />
              <el-button circle :icon="Fingerprint" />
            </div>
          </div> -->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Monitor, User, Lock } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { login } from "@/api/login";
import { useUserStore } from "@/store/user";

interface LoginForm {
  username: string;
  password: string;
}

const router = useRouter();
const userStore = useUserStore();

const loginFormRef = ref<FormInstance>();
const loginLoading = ref(false);
const rememberPassword = ref(false);

const loginForm = reactive<LoginForm>({
  username: "",
  password: "",
});

const loginRules: FormRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度至少6位", trigger: "blur" },
  ],
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    loginLoading.value = true;

    loginForm.username = loginForm.username.trim();
    loginForm.password = loginForm.password.trim();

    const response = await login(loginForm.username, loginForm.password);
    loginLoading.value = false;
    if (response.code === 200) {
      const { user, token } = response.data as unknown as {
        user: any;
        token: string;
      };
      console.log("User:", user);
      console.log("Token:", token);
      localStorage.setItem("blog_token", token);
      console.log("Login response:", response.data);
      userStore.setUser(user);
      router.push("/");
      ElMessage.success("登录成功!");
    } else {
      ElMessage.error(response.message || "登录失败，请重试");
    }
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.left-section {
  flex: 1;
  background: url("https://ai-public.mastergo.com/ai/img_res/a47790954d8871408bcd9e2a0c7feca8.jpg")
    center/cover;
  position: relative;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
}

.left-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(30, 144, 255, 0.8),
    rgba(0, 123, 255, 0.9)
  );
  z-index: 1;
}

.logo-section {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 40px;
  font-size: 24px;
  font-weight: bold;
}

.logo-icon {
  font-size: 32px;
  margin-right: 12px;
}

.tagline {
  position: relative;
  z-index: 2;
  padding: 0 40px;
  font-size: 16px;
  opacity: 0.9;
  margin-top: -20px;
}

.floating-cubes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}

.cube {
  position: absolute;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
  animation: float 6s ease-in-out infinite;
}

.cube::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  transform: translateZ(-1px);
}

.cube-1 {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.cube-2 {
  top: 35%;
  right: 20%;
  animation-delay: -1s;
  width: 40px;
  height: 40px;
}

.cube-3 {
  top: 60%;
  left: 25%;
  animation-delay: -2s;
  width: 50px;
  height: 50px;
}

.cube-4 {
  top: 45%;
  left: 60%;
  animation-delay: -3s;
  width: 35px;
  height: 35px;
}

.cube-5 {
  top: 75%;
  right: 30%;
  animation-delay: -4s;
  width: 45px;
  height: 45px;
}

.cube-6 {
  top: 25%;
  left: 50%;
  animation-delay: -5s;
  width: 30px;
  height: 30px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.bottom-text {
  position: relative;
  z-index: 2;
  padding: 0 40px;
  margin-top: auto;
  margin-bottom: 60px;
}

.bottom-text h2 {
  font-size: 36px;
  margin-bottom: 10px;
  font-weight: bold;
}

.bottom-text h3 {
  font-size: 28px;
  margin-bottom: 20px;
  font-weight: bold;
}

.bottom-text p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 40px;
}

.login-form-container {
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.login-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 40px;
}

.login-form {
  width: 100%;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.forgot-password {
  color: #4a90e2;
  padding: 0;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(135deg, #4a90e2, #357abd);
  border: none;
  margin-bottom: 32px;
}

.other-login {
  text-align: center;
}

.other-login span {
  color: #999;
  font-size: 14px;
  margin-bottom: 16px;
  display: block;
}

.login-methods {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.login-methods .el-button {
  width: 44px;
  height: 44px;
  border-color: #ddd;
  color: #666;
}

.login-methods .el-button:hover {
  border-color: #4a90e2;
  color: #4a90e2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .left-section {
    height: 40vh;
    min-height: 250px;
  }

  .right-section {
    height: 60vh;
    padding: 20px;
    overflow-y: auto;
  }

  .bottom-text {
    margin-bottom: 20px;
  }

  .bottom-text h2 {
    font-size: 24px;
  }

  .bottom-text h3 {
    font-size: 20px;
  }
}
</style>
