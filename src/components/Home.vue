<template>
  <div class="home">
    <div class="about">
    </div>
    <div class="logo">
    {{ SITE_NAME }}
    </div>
    <div class="search-container" :key="searchBoxKey">
      <div class="gcse-searchbox-only" data-resultsUrl="search"></div>
    </div>

    <!-- 添加页脚 -->
    <footer>
      2025 &copy; {{ SITE_NAME }}. All rights reserved.
    </footer>
  </div>
</template>

<script>
import { loadGoogleCSE } from '@/utils/loadGoogleCSE';
import { SITE_NAME } from '@/config/constants';

export default {
  name: 'HomePage',
  data() {
    return {
      searchBoxKey: 0,
      SITE_NAME
    };
  },
  mounted() {
    // 重置页面标题为首页标题
    document.title = SITE_NAME;

    // 每次挂载时增加 key，强制重新渲染
    this.searchBoxKey++;

    loadGoogleCSE()
      .then(() => {
        // 等待 Vue 更新 DOM
        this.$nextTick(() => {
          // 延迟一小段时间，确保 CSE 能够扫描到新的 DOM 元素
          setTimeout(() => {
            if (window.google && window.google.search && window.google.search.cse && window.google.search.cse.element) {
              try {
                // 触发 CSE 重新扫描页面
                window.google.search.cse.element.go();
              } catch (error) {
                // 忽略错误，CSE 可能已经自动渲染了
              }
            }

            // 清空搜索框内容
            this.clearSearchBox();
          }, 100);
        });
      })
      .catch((error) => {
        console.error('加载 Google CSE 脚本失败', error);
      });
  },
  methods: {
    clearSearchBox() {
      // 查找并清空 Google CSE 搜索框
      try {
        const searchInput = document.querySelector('.gsc-input input.gsc-input');
        if (searchInput) {
          searchInput.value = '';
        }

        // 清空所有可能的搜索输入框
        const allSearchInputs = document.querySelectorAll('input[name="search"]');
        allSearchInputs.forEach(input => {
          input.value = '';
        });
      } catch (error) {
        console.warn('清空搜索框失败', error);
      }
    }
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
  font-size: 45px;
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
