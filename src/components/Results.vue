<template>
  <div class="my-container">
    <div class="search-container" id="searchContainer">
      <h1 class="search-title" @click="goHome">Ferris Search</h1>
      <div class="gcse-searchbox"></div>
    </div>
    <div class="search-result-zone">
      <div v-if="loading" class="loading" role="status">加载中...</div>
      <div class="gcse-searchresults" data-linkTarget="_blank" data-refinementStyle="link"></div>
    </div>
    <footer>
     
    </footer>
  </div>
</template>

<script>
import { loadGoogleCSE } from '@/utils/loadGoogleCSE';

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
      cleanupRenderedCallback: null
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
        document.title = trimmed ? `${trimmed} - Ferris Search` : 'Ferris Search';
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
  /* 让容器占满整个视窗高度 */
  max-width: var(--center-width);
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
    font-size: 20px;
    margin-bottom: 10px;
    margin-right: 0;
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
  margin-left: 28px;
  color: var(--uv-styles-color-text-default);
  font-size: 14px;
}

/* Footer styles */
footer {
  background-color: #f8f9fa;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  color: #6c757d;
  border-top: 1px solid #dee2e6;
  margin-top: 36px;
}

/* 链接样式 */
footer a {
  color: #156bc8; /* 白天模式下的鲜明蓝色 */
  font-weight: bold; /* 加粗字体 */
  transition: color 0.3s ease, text-shadow 0.3s ease; /* 添加文本阴影过渡 */
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  footer {
    background-color: #1a1a1a; /* 深色背景 */
  }
  
  footer a {
    color: #ffffff; /* 明亮的链接颜色 */
  }
}

/* 鼠标悬停效果 */
footer a:hover {
  color: #0056b3; /* 鼠标悬停时的深蓝色 */
  text-decoration: underline; /* 添加下划线 */
  text-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 鼠标悬停时添加阴影 */
}

footer img {
  width: 16px;
  height: 16px;
  vertical-align: text-top;
  margin-right: 3px;
  opacity: 0.8;
}

@media (prefers-color-scheme: dark) {
  footer {
    background-color: #222222;
    /* 深色背景 */
    color: #cccccc;
    /* 浅灰色字体，确保可读性 */
    border-top: 1px solid #444444;
    /* 深色边框 */
  }

  footer a {
    color: #80a0c2;
    /* 链接颜色改为浅色 */
  }

  footer a:hover {
    color: #a0c3e0;
    /* 悬停时的链接颜色略微加亮 */
  }

  footer img {
    opacity: 0.9;
    /* 提高图像的亮度，适应深色背景 */
  }
}
</style>
