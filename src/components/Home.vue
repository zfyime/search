<template>
  <div class="home">
    <div class="about">
    </div>
    <div class="logo">
    Ferris Search
    </div>
    <div class="search-container">
      <div class="gcse-searchbox-only" data-resultsUrl="search"></div>
    </div>
    
    <!-- 添加页脚 -->
    <footer>
     
    </footer>
  </div>
</template>

<script>
import { loadGoogleCSE } from '@/utils/loadGoogleCSE';

export default {
  name: 'HomePage',
  mounted() {
    loadGoogleCSE().catch((error) => {
      console.error('加载 Google CSE 脚本失败', error);
    });
  }
};
</script>

<style scoped>
.home {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  position: absolute;
  top: 35vh; /* 从 30vh 增加到 35vh */
  font-size: 48px;
  font-weight: bold;
}

.search-container {
  position: absolute;
  top: calc(35vh + 100px); /* 相应地调整，保持与 logo 的相对位置 */
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 针对小屏幕的样式 */
@media (max-width: 600px) {
  .logo {
    font-size: 35px;
    top: 37vh; /* 从 30vh 增加到 35vh */
  }
  .search-container {
    top: calc(37vh + 80px);
  }
}

.about {
  position: absolute;
  top: 20px;
  right: 20px;
}

.about a {
  text-decoration: none;
  font-size: 16px;
  color: var(--uv-styles-color-text-default);
}
</style>
