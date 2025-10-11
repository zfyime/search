<template>
  <div class="my-container">
    <div class="search-container" id="searchContainer">
      <h1 class="search-title" @click="goHome">{{ SITE_NAME }}</h1>
      <div class="gcse-searchbox"></div>
    </div>
    <div class="search-result-zone">
      <div v-if="loading" class="loading" role="status">
        <div class="loading-spinner"></div>
        <span class="loading-text">搜索中...</span>
      </div>
      <div class="gcse-searchresults" data-linkTarget="_blank" data-refinementStyle="link"></div>
    </div>
    <footer>
      2025 &copy; {{ SITE_NAME }}. All rights reserved.
    </footer>
  </div>
</template>

<script>
import { loadGoogleCSE } from '@/utils/loadGoogleCSE';
import { SITE_NAME } from '@/config/constants';

export default {
  name: 'SearchPage',
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: true,
      cleanupRenderedCallback: null,
      SITE_NAME
    };
  },
  async mounted() {
    this.setupResultsRenderedCallback();

    if (!this.query) {
      this.loading = false;
      this.goHome();
      return;
    }

    try {
      await loadGoogleCSE();
    } catch (error) {
      console.error('加载 Google CSE 脚本失败', error);
    }

    this.loading = false;
    this.sanitizeResultLinks();
    this.setTitle();
  },
  beforeUnmount() {
    if (typeof this.cleanupRenderedCallback === 'function') {
      this.cleanupRenderedCallback();
    }
  },
  watch: {
    query(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.loading = true;
      }
      this.setTitle();
    }
  },
  methods: {
    setTitle() {
      try {
        const searchInput = document.getElementsByName('search')[0];
        const rawValue = searchInput?.value || this.query || '';
        const trimmed = rawValue.trim();
        document.title = trimmed ? `${trimmed} - ${SITE_NAME}` : SITE_NAME;
      } catch (error) {
        console.error('设置页面标题失败', error);
      }
    },
    goHome() {
      if (this.$router) {
        const target = { name: 'Home' };
        if (this.$route?.name === 'Home') {
          return;
        }
        this.$router.push(target).catch((err) => {
          if (err && err.name !== 'NavigationDuplicated') {
            console.error('跳转首页失败', err);
          }
        });
      } else {
        window.location.href = '/';
      }
    },
    sanitizeResultLinks() {
      try {
        const links = document.querySelectorAll('a.gs-title');
        links.forEach((anchor) => {
          anchor.removeAttribute('data-cturl');
          anchor.removeAttribute('data-ctorig');
        });
      } catch (error) {
        console.error('清理搜索结果链接属性失败', error);
      }
    },
    setupResultsRenderedCallback() {
      const myWebResultsRenderedCallback = () => {
        this.loading = false;
        this.sanitizeResultLinks();
        this.setTitle();
      };

      if (typeof window === 'undefined') {
        return;
      }

      window.__gcse = window.__gcse || {};
      const searchCallbacks = window.__gcse.searchCallbacks || {};
      const webCallbacks = searchCallbacks.web || {};
      const previousRendered = webCallbacks.rendered;

      window.__gcse.searchCallbacks = {
        ...searchCallbacks,
        web: {
          ...webCallbacks,
          rendered: myWebResultsRenderedCallback
        }
      };

      this.cleanupRenderedCallback = () => {
        if (typeof window === 'undefined' || !window.__gcse) {
          return;
        }
        const currentSearchCallbacks = window.__gcse.searchCallbacks || {};
        const currentWebCallbacks = currentSearchCallbacks.web || {};
        window.__gcse.searchCallbacks = {
          ...currentSearchCallbacks,
          web: {
            ...currentWebCallbacks,
            rendered: previousRendered
          }
        };
      };
    }
  }
};
</script>
<style scoped>
.my-container {
  display: flex;
  flex-direction: column;
  /* 让子元素垂直排列 */
  min-height: 100vh;
  min-width: 320px;
  box-sizing: border-box;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 26px;
  margin-left: 28px;
  min-height: 48px;
}

.search-title {
  font-size: 24px;
  color: #58636f;
  margin-right: 20px;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  /* 防止标题文字被选中 */
}

/* 针对小屏幕的样式 */
@media (max-width: 600px) {
  .search-container {
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    margin-left: 0px;
    min-height: 48px;
    width: 100vw;
  }

  .search-title {
    font-size: 28px;
    margin-bottom: 10px;
    margin-right: 0;
    cursor: pointer;
  }
}

/* 黑暗模式样式 */
@media (prefers-color-scheme: dark) {
  .search-title {
    color: #d1d5db;
    /* 黑暗模式下的颜色 */
  }
}

.search-result-zone {
  flex-grow: 1;
  /* 让搜索结果区占据剩余空间 */
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 60px;
  color: var(--uv-styles-color-text-default);
  font-size: 14px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--uv-styles-color-outline);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  color: var(--uv-styles-color-text-secondary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 移动端加载样式 */
@media (max-width: 600px) {
  .loading {
    margin-top: 40px;
  }
}
</style>
