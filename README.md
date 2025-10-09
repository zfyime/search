<div align="center">

# Ferris Search

**基于 Google CSE 的干净搜索引擎**

[在线体验](https://search.luxirty.com) · [反馈问题](https://github.com/KoriIku/luxirty-search/issues) · [贡献指南](#contribute)

[![License](https://img.shields.io/github/license/KoriIku/luxirty-search)](LICENSE)
[![Stars](https://img.shields.io/github/stars/KoriIku/luxirty-search)](https://github.com/KoriIku/luxirty-search/stargazers)

一个基于 Google 的搜索引擎，**服务端屏蔽**内容农场，无广告，无跟踪，干净，简洁，快。

</div>

---

## 🚀 快速开始

### 添加到浏览器

访问 [search.luxirty.com](https://search.luxirty.com) 后，浏览器会自动提示添加搜索引擎。

**手动添加**：
- 搜索引擎 URL: `https://search.luxirty.com/search?q=%s`
- 或使用你的域名: `你的域名/search?q=%s`

## ✨ 特性&功能

### 🛡️ 服务端屏蔽内容农场

内置屏蔽低质量网站，包括：
- CSDN、掘金等技术博客的低质量内容
- 华为云、百度云智能、腾讯云开发者等 SEO 网站
- StackOverflow 中文翻译站（机器翻译质量差）
- 各类内容农场和采集站

> [!NOTE]
> 📋 查看完整屏蔽名单: [/docs/block_list.txt](/docs/block_list.txt)

### ⚡ 智能权重提升

点击 `For Program` 标签一键提升优质来源权重：
- GitHub - 代码仓库
- StackOverflow - 技术问答
- V2EX - 技术社区
- 博客园 - 技术博客

**无需手动输入** `site:github.com`，一键即可优先显示这些网站的结果。

### 🎯 其他特性

- ✅ **一键搜索**: 快速切换 V2EX、Reddit 等平台搜索
- ✅ **广告屏蔽**: Service Worker 拦截广告请求
- ✅ **隐私保护**: 移除 Google 跟踪链接
- ✅ **暗黑模式**: 自动适配系统主题
- ✅ **移动端优化**: 响应式设计，完美支持移动设备
- ✅ **PWA 支持**: 可安装到桌面，离线访问

## 🆚 与浏览器插件的区别

### 传统方案 (uBlacklist, Hit by Hidden 等)
❌ **前端过滤**：内容农场已经占用搜索结果位置，然后才被隐藏
❌ **性能开销**：需要加载额外的 JavaScript 进行过滤
❌ **结果减少**：隐藏后可能导致一页结果不足

### Ferris Search 方案
✅ **服务端屏蔽**：在 Google 服务器执行搜索时就已排除垃圾网站
✅ **零性能开销**：相当于内置多条 `-site:domain.com`
✅ **结果完整**：Google 会自动补充其他高质量结果

**简单来说**：Ferris Search 让垃圾网站根本不会出现在搜索结果中，而不是先显示再隐藏。

## 🤝 Contribute

欢迎贡献代码和提出建议！

### 📝 贡献方式

#### 1. 优化样式
本项目的一大价值是美化 Google CSE 的默认样式。目前已完成：
- ✅ 基础样式调整
- ✅ 暗黑模式适配
- ✅ 移动端响应式

但仍有改进空间：
- ⚠️ 不同屏幕尺寸的细节适配
- ⚠️ 暗黑模式下部分元素亮度优化
- ⚠️ 动画和过渡效果

**如何贡献**：
1. Fork 本仓库
2. 修改 `src/assets/main.css` 或 `src/assets/base.css`
3. 本地测试（`pnpm dev`）
4. 提交 PR

#### 2. 分享黑名单/白名单

**黑名单**（屏蔽的低质量网站）：
- 在 [Issues](https://github.com/KoriIku/luxirty-search/issues) 中提交域名
- 说明屏蔽理由
- 我们会定期更新到 [/docs/block_list.txt](/docs/block_list.txt)

**白名单**（优质来源网站）：
- 分享高质量的技术网站
- 建议新的 Refinement Label 标签
- 例如：特定编程语言的官方文档、知名技术博客等

#### 3. 功能开发

**未来计划**：
- [ ] 根据标题进行二次拦截
- [ ] 自动翻页功能
- [ ] 搜索历史记录
- [ ] 更多搜索引擎支持

**开发指南**：
1. 查看 [CLAUDE.md](CLAUDE.md) 了解项目架构
2. 遵循现有代码风格
3. 测试多种场景（明暗模式、移动端等）
4. 提交前运行 `pnpm build` 确保构建成功

#### 4. 分享使用经验

如果你写了关于本项目的文章（部署教程、使用心得等），欢迎在 Issues 中分享链接，我们会添加到 README 中。

### 📚 技术栈

只需基础前端知识即可上手：
- Vue 3 (简单的组件结构)
- CSS (样式覆盖为主)
- JavaScript (少量逻辑代码)

**完整技术栈**：
- 前端框架: Vue 3.4.29
- 构建工具: Vite 5.3.1
- 路由: Vue Router 4.3.3
- 样式: 原生 CSS (CSS Variables)

## 🔧 工作原理

Ferris Search 基于 **Google Custom Search Engine (CSE)**，通过以下技术实现功能：

### 核心技术

#### 1. **Annotations（网站屏蔽）**
- 在 Google CSE 控制台配置 Annotations
- 效果等同于在每次搜索时自动添加 `-site:csdn.net -site:huaweicloud.com ...`
- **服务端处理**：Google 服务器在执行搜索时就已排除这些网站
- 不占用搜索结果位置，不影响性能

#### 2. **Refinement Labels（权重提升）**
- 为优质网站（GitHub、StackOverflow 等）创建标签
- 点击标签后，这些网站的搜索结果优先级提升
- 免去手动输入 `site:github.com` 的麻烦

#### 3. **Service Worker（广告屏蔽）**
- 拦截包含 `adsense` 的请求，返回 204 空响应
- 提升页面加载速度
- 支持离线访问（PWA）

#### 4. **搜索回调（隐私保护）**
- 监听 Google CSE 的搜索结果渲染事件
- 移除搜索结果中的 `data-cturl` 和 `data-ctorig` 跟踪属性
- 保护用户点击隐私

#### 5. **自定义样式（界面美化）**
- 使用 CSS Variables 定义主题变量
- 深度覆盖 Google CSE 默认样式（使用 `!important`）
- 通过 `@media (prefers-color-scheme: dark)` 自动切换暗黑模式
- 响应式断点：600px（移动端/桌面端）

### 技术架构图

```
用户输入搜索词
     ↓
Vue Router 路由跳转 (/search?q=...)
     ↓
Google CSE 加载并执行搜索
     ├─ Annotations: 服务端排除黑名单网站
     └─ Refinement Labels: 提升白名单权重
     ↓
返回搜索结果
     ↓
搜索回调移除跟踪链接
     ↓
自定义 CSS 美化展示
```

### 为什么选择 Google CSE？

✅ **权威性**：基于 Google 搜索引擎，结果质量有保证
✅ **可定制**：支持 Annotations 和 Refinement Labels
✅ **免费额度**：个人使用完全够用
✅ **易部署**：纯前端项目，无需后端服务器

## ⚠️ 已知限制

以下限制由 **Google CSE 平台**导致，暂无解决方案：

| 限制 | 说明 | 影响 |
|------|------|------|
| 🔍 地址栏补全 | 设置为浏览器默认引擎时，地址栏无法自动补全 | 网页中的搜索框仍有自动补全 |
| ⏰ 时间筛选 | 无法根据时间范围筛选结果 | 需手动查看结果发布时间 |
| 🔤 同义词搜索 | 不支持同义词替换和智能纠错 | 结果可能少于 Google 官网 |
| 📊 搜索次数 | 免费版每天有搜索次数限制 | 个人使用基本够用 |

> [!TIP]
> 虽然有这些限制，但对于日常技术搜索来说，屏蔽内容农场带来的体验提升远大于这些不便。

---

## 📦 部署指南

Ferris Search 是一个纯静态的 Vue 3 + Vite 项目，可以部署到任何静态托管平台。

### 一键部署（推荐）

#### Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKoriIku%2Fluxiry-search&project-name=luxirty-search&repository-name=luxirty-search)

✅ 搜索页 404 问题已修复

#### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/KoriIku/luxirty-search)

#### Docker
```bash
docker run --rm -p 80:80 ghcr.io/koriiku/luxirty-search
```

感谢 [@shadowofmoo](https://github.com/shadowofmoo) 提供 Docker 支持

### 手动部署

#### 1. 克隆仓库
```bash
git clone https://github.com/KoriIku/luxirty-search.git
cd luxirty-search
```

#### 2. 安装依赖
```bash
pnpm install
# 或
npm install
# 或
yarn install
```

#### 3. 本地开发
```bash
pnpm dev
```
访问 `http://localhost:5173`

#### 4. 构建生产版本
```bash
pnpm build
```
构建产物在 `dist/` 目录

#### 5. 预览生产构建
```bash
pnpm preview
```

### 部署到其他平台

根据 [Vite 官方部署指南](https://cn.vitejs.dev/guide/static-deploy) 部署到：
- GitHub Pages
- Cloudflare Pages
- Firebase Hosting
- 自有服务器（Nginx/Apache）
- 任何支持静态文件托管的平台

### 使用自定义 Google CSE（可选）

默认使用项目提供的 CSE，如果你想使用自己的：

#### 1. 创建 Google CSE
访问 [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/) 创建搜索引擎

#### 2. 配置环境变量
创建 `.env` 文件：
```env
VITE_GOOGLE_CSE_CX=你的搜索引擎ID
VITE_BASE_URL='./'
VITE_OPEN_SEARCH_ShortName=你的搜索引擎名称
VITE_OPEN_SEARCH_UrlTemplateBase=https://你的域名.com
```

#### 3. 配置 Annotations 和 Refinement Labels
在 Google CSE 控制台：
1. **Annotations**：添加要屏蔽的网站（参考 [/docs/block_list.txt](/docs/block_list.txt)）
2. **Refinement Labels**：创建标签（如 "For Program"），添加优质网站

详细步骤参考：[Issue #14](https://github.com/KoriIku/luxirty-search/issues/14)

### 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_GOOGLE_CSE_CX` | Google CSE 搜索引擎 ID | 项目提供的 CSE |
| `VITE_BASE_URL` | 应用基础路径 | `'./'` |
| `VITE_OPEN_SEARCH_ShortName` | OpenSearch 短名称 | `'Ferris Search'` |
| `VITE_OPEN_SEARCH_UrlTemplateBase` | OpenSearch URL 模板 | 你的域名 |

---

## 🛠️ 本地开发

### 环境要求
- Node.js >= 16
- pnpm / npm / yarn

### 开发流程

1. **克隆并安装**
```bash
git clone https://github.com/KoriIku/luxirty-search.git
cd luxirty-search
pnpm install
```

2. **启动开发服务器**
```bash
pnpm dev
```
访问 `http://localhost:5173`

3. **修改代码**
- Vue 组件: `src/components/`
- 样式文件: `src/assets/main.css` (CSE 样式覆盖)
- 样式变量: `src/assets/base.css` (主题颜色)
- 路由配置: `src/router/index.js`

4. **构建测试**
```bash
pnpm build      # 构建生产版本
pnpm preview    # 预览构建结果
```

### 项目结构

```
src/
├── components/
│   ├── Home.vue        # 首页（搜索框）
│   └── Results.vue     # 搜索结果页
├── router/
│   └── index.js        # 路由配置
├── assets/
│   ├── main.css        # Google CSE 样式覆盖
│   └── base.css        # CSS 变量和基础样式
├── App.vue             # 根组件
└── main.js             # 入口文件（Service Worker 注册）

public/
└── service-worker.js   # Service Worker（广告拦截）

scripts/
└── vite-plugin-generate-opensearch.js  # OpenSearch 插件
```

### 调试技巧

#### 查看 Google CSE 对象
```javascript
// 浏览器控制台
console.log(window.__gcse);
console.log(window.__gcse.searchCallbacks);
```

#### 调试 Service Worker
1. 打开 Chrome DevTools
2. Application 标签 → Service Workers
3. 可以手动卸载/更新 Service Worker

#### 修改样式
1. 浏览器 DevTools 找到目标元素
2. 查看 Google CSE 的原始类名
3. 在 `main.css` 中添加覆盖样式（使用 `!important`）
4. 同时添加暗黑模式和移动端适配

### 参考资料

**必读**：
- [Google Custom Search Element API](https://developers.google.com/custom-search/docs/element)
- [Vite 文档](https://cn.vitejs.dev/)
- [Vue 3 文档](https://cn.vuejs.org/)

**扩展阅读**：
- [OpenSearch 规范](https://developer.mozilla.org/zh-CN/docs/Web/OpenSearch)
- [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [CSS Variables](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)


---

## 📝 更新日志

### 最近更新
- ⚡ 优化启动速度
- 🔒 添加搜索结果跟踪链接移除功能（`data-cturl`, `data-ctorig`）
- 🎨 移除文字阴影，提升可读性
- 🌓 完善暗黑模式适配
- 📱 优化移动端响应式布局

### 未来计划
- [ ] 根据标题进行二次过滤
- [ ] 自动翻页功能
- [ ] 搜索历史记录
- [ ] 更多平台搜索支持

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 🙏 致谢

- 感谢 [Google Custom Search Engine](https://programmablesearchengine.google.com/) 提供搜索服务
- 感谢所有贡献者和用户的支持
- 特别感谢 [@shadowofmoo](https://github.com/shadowofmoo) 提供 Docker 支持

---

## 📞 联系方式

- 🐛 反馈问题：[GitHub Issues](https://github.com/KoriIku/luxirty-search/issues)
- 💡 功能建议：[GitHub Discussions](https://github.com/KoriIku/luxirty-search/discussions)
- 🔀 提交代码：[Pull Requests](https://github.com/KoriIku/luxirty-search/pulls)

---

## ⭐ Star History

<a href="https://star-history.com/#KoriIku/luxirty-search&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=KoriIku/luxirty-search&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=KoriIku/luxirty-search&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=KoriIku/luxirty-search&type=Date" />
 </picture>
</a>
