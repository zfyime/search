
## 项目介绍

Ferris Search 是一个基于 Google CSE 的搜索引擎前端应用，主要特点：
- 屏蔽内容农场和低质量网站
- 无广告、无跟踪
- 提供快捷的编程相关搜索
- 支持暗黑模式和移动端适配

## 技术栈

- **前端框架**: Vue 3.4.29 (Composition API & Options API)
- **构建工具**: Vite 5.3.1
- **路由**: Vue Router 4.3.3
- **语言**: JavaScript (ESM)
- **样式**: 原生 CSS (CSS Variables + Media Queries)
- **搜索引擎**: Google Custom Search Engine (CSE)
- **PWA**: Service Worker (广告拦截 + 缓存策略)

## 项目结构

```
search/
├── src/
│   ├── components/       # Vue 组件
│   │   ├── Home.vue     # 首页/搜索框组件
│   │   └── Results.vue  # 搜索结果展示组件
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── assets/          # 静态资源
│   │   ├── main.css     # 主样式文件
│   │   ├── base.css     # 基础样式
│   │   └── logo.svg
│   ├── App.vue          # 根组件
│   └── main.js          # 应用入口
├── public/
│   └── service-worker.js # Service Worker
├── scripts/
│   └── vite-plugin-generate-opensearch.js  # 自定义 Vite 插件
├── docs/
│   └── block_list.txt   # 屏蔽网站名单
├── conf/                # 配置文件目录
├── .env                 # 环境变量
├── vite.config.js       # Vite 配置
├── index.html           # HTML 入口
├── Dockerfile           # Docker 配置
├── vercel.json          # Vercel 部署配置
├── CLAUDE.md            # AI 助手指令文件
└── README.md            # 项目说明
```

## 开发规范

### 基本原则

- **使用中文回复用户**: 所有与用户的交互都使用中文
- **简单可维护**: 实现应简洁明了，不需要考虑太多防御性的边界条件
- **充分调研**: 在开始设计方案或实现代码之前，必须进行充分的调研。如果有任何不明确的要求，请在继续之前向我确认

### 代码风格

- 使用 ESM 模块语法（`import/export`）
- 使用有意义的变量名和函数名
- Vue 组件采用 SFC (Single File Component) 格式
- CSS 优先使用语义化的类名
- 适当添加注释，说明复杂逻辑

### 开发流程

1. **需求确认**: 确保完全理解需求后再开始实现
2. **方案设计**: 先设计方案，与用户确认后再编码
3. **代码实现**: 编写简洁可维护的代码
4. **本地测试**: 使用 `pnpm dev` 本地验证功能
5. **构建验证**: 使用 `pnpm build` 确保生产构建正常

### 环境变量

项目使用 `.env` 文件管理环境变量，以下是完整配置：

- `VITE_GOOGLE_CSE_CX`: Google CSE 的搜索引擎 ID
- `VITE_BASE_URL`: 应用基础路径（默认 './'）
- `VITE_OPEN_SEARCH_ShortName`: OpenSearch 描述文件中的短名称
- `VITE_OPEN_SEARCH_UrlTemplateBase`: OpenSearch URL 模板基础路径

## 开发命令

```bash
# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 生产构建
pnpm build

# 预览构建结果
pnpm preview
```

## Git 提交规范

提交信息格式:
```
<type>: <subject>
```

Type 类型:
- `feat`: 新功能
- `fix`: 修复 bug
- `style`: 样式调整（UI/CSS）
- `refactor`: 重构代码
- `docs`: 文档更新
- `chore`: 构建/配置相关

示例:
```
feat: 添加搜索历史记录功能
fix: 修复暗黑模式下按钮颜色问题
style: 优化移动端搜索框样式
```

## 核心功能说明

### 1. 搜索结果屏蔽
通过 Google CSE 的 Annotations 功能在服务端直接屏蔽低质量网站，而非前端过滤。

**实现原理**：
- 配置 Annotations 相当于内置多条 `-site:domain.com`
- 在 Google 服务器执行搜索时就已排除这些网站
- 优于浏览器插件的前端过滤方案，性能更好

### 2. 权重提升
使用 Refinement Labels 功能为优质来源（如 GitHub、StackOverflow）提升权重。

**使用方式**：
- 点击搜索结果上方的"For Program"等标签
- 自动提升相关优质网站的排序权重
- 无需手动输入 `site:` 语法

### 3. Service Worker
**位置**: `public/service-worker.js`

**功能**：
- 拦截包含 'adsense' 的广告请求，返回 204 空响应
- 使用 `skipWaiting()` 和 `clients.claim()` 立即激活
- 提升页面加载速度和离线访问能力

**注意事项**：
- Service Worker 注册失败不影响核心功能
- 修改后需清除浏览器缓存或使用硬刷新

### 4. OpenSearch 支持
通过自定义 Vite 插件生成 opensearch.xml，支持添加到浏览器搜索引擎。

**实现位置**: `scripts/vite-plugin-generate-opensearch.js`

**工作流程**：
1. 从环境变量读取配置
2. 开发环境通过 Vite 中间件提供 `/opensearch.xml`
3. 生产构建时生成静态 `opensearch.xml` 文件
4. 用户访问时浏览器自动识别并提示添加

### 5. 跟踪链接移除
**位置**: `src/components/Results.vue:42-64`

**功能**：
- 在搜索结果渲染后移除 `data-cturl` 和 `data-ctorig` 属性
- 保护用户隐私，避免 Google 跟踪点击行为
- 通过 `window.__gcse.searchCallbacks` 注册回调实现

### 6. 样式定制
**位置**: `src/assets/main.css` 和 `src/assets/base.css`

**特点**：
- 使用 CSS Variables 实现主题切换
- 深度覆盖 Google CSE 默认样式
- 响应式设计：桌面端固定宽度，移动端全宽自适应
- 暗黑模式通过 `@media (prefers-color-scheme: dark)` 自动切换

**关键类名**：
- `.gsc-search-box-tools`: 搜索框容器
- `.gsc-results`: 搜索结果容器
- `.gs-title`: 搜索结果标题
- `.gs-snippet`: 搜索结果摘要

## 注意事项

### 开发注意事项
- 优先保证功能实现，不过度优化
- 样式修改需同时考虑暗黑模式和移动端适配
- 修改屏蔽名单时需更新 docs/block_list.txt
- 遇到不确定的需求及时与用户沟通
- 保持代码简单直接，易于理解和维护

### 常见问题

**1. 修改 CSS 后样式不生效**
- Google CSE 会注入自己的样式，需要使用 `!important` 覆盖
- 检查 CSS 选择器优先级是否足够
- 清除浏览器缓存或使用硬刷新（Ctrl+Shift+R）

**2. 本地开发时搜索功能异常**
- 检查 `.env` 文件中的 `VITE_GOOGLE_CSE_CX` 是否正确
- 确保 Google CSE 脚本加载成功（查看浏览器控制台）
- 检查网络连接，CSE 需要访问 Google 服务器

**3. Service Worker 更新不生效**
- 在浏览器开发者工具中卸载旧的 Service Worker
- 使用无痕模式测试
- 检查 `main.js` 中的 Service Worker 注册逻辑

**4. 移动端样式错乱**
- 检查 `@media (max-width: 600px)` 断点样式
- 确保使用了 `viewport` meta 标签
- 测试不同屏幕尺寸（可使用浏览器开发者工具）

### 已知限制（Google CSE 限制）
- 无法根据时间筛选结果
- 缺少同义词搜索（不如 Google 官网智能）
- 设置为浏览器默认引擎时，地址栏无法自动补全（网页中有自动补全）
- 每天有搜索次数限制（免费版）

### 性能优化建议
- CSS 文件较大，可考虑按需加载或模块化
- 避免在 `Home.vue` 和 `Results.vue` 中重复加载 CSE 脚本
- 考虑使用 CSS 变量减少硬编码的数值
- 添加 CSE 加载失败的错误处理

## 参考资源

### 官方文档
- [Google Custom Search Element API](https://developers.google.com/custom-search/docs/element)
- [Vite 文档](https://cn.vitejs.dev/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [OpenSearch 规范](https://developer.mozilla.org/zh-CN/docs/Web/OpenSearch)

### 项目相关
- [屏蔽网站名单](docs/block_list.txt)
- [部署教程](README.md#部署)
- [已知缺陷](README.md#已知缺陷)

## 架构说明

### 路由设计
- `/` - 首页，显示搜索框
- `/search?q=关键词` - 搜索结果页

### 组件通信
- 首页通过 Google CSE 的 `data-resultsUrl` 属性跳转到搜索结果页
- 搜索结果页通过 `route.query.q` 获取搜索关键词
- 无搜索词时自动跳转回首页

### CSS 架构
```
base.css          # 基础样式和 CSS 变量定义
  ├── 颜色变量    # 明暗主题颜色
  ├── 字体变量    # 字体族和字重
  └── 布局变量    # 间距和尺寸

main.css          # Google CSE 样式覆盖
  ├── 搜索框样式  # .gsc-search-box-tools
  ├── 结果样式    # .gsc-results, .gs-title, .gs-snippet
  ├── 响应式适配  # @media queries
  └── 暗黑模式    # @media (prefers-color-scheme: dark)
```

### 构建流程
1. Vite 读取 `.env` 环境变量
2. Vue 插件编译 `.vue` 文件
3. OpenSearch 插件生成 `opensearch.xml`
4. 打包输出到 `dist/` 目录
5. 复制 `service-worker.js` 到输出目录

## 开发技巧

### 调试 Google CSE
```javascript
// 在浏览器控制台查看 CSE 对象
console.log(window.__gcse);

// 查看搜索回调
console.log(window.__gcse.searchCallbacks);
```

### 查看 Service Worker 状态
1. 打开浏览器开发者工具
2. 进入 Application/应用程序 标签
3. 查看 Service Workers 部分
4. 可以手动卸载/更新

### 本地测试生产构建
```bash
pnpm build
pnpm preview
# 在浏览器中访问 http://localhost:4173
```

### 修改样式的步骤
1. 在浏览器开发者工具中找到目标元素
2. 识别 Google CSE 的原始类名
3. 在 `main.css` 中添加覆盖样式（使用 `!important`）
4. 同时添加暗黑模式和移动端适配
5. 测试不同场景下的显示效果
