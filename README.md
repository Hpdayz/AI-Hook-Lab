# AI Hook Lab

AI 驱动的爆款内容开头生成器，支持小红书、抖音、B站三大平台，12 种文案风格，一键生成 10 个高质量 Hook。

## 功能特性

- **多平台适配** — 小红书、抖音、B站，每个平台有专属的文案风格偏好
- **多内容类型** — 视频、图文、产品广告、教程、观点贴
- **12 种 Hook 风格** — 悬念型、共鸣型、反差型、痛点型、数据型、故事型、挑战型、幽默型、权威型、好奇型、恐惧型、利益型
- **收藏与历史** — 支持收藏喜欢的 Hook，自动记录生成历史
- **一键复制** — 单条复制或一键复制全部结果

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite 6
- **样式方案**: Tailwind CSS 4
- **AI 接口**: Anthropic Claude API

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

### 配置 API Key

启动应用后，点击页面右上角设置按钮，输入你的 Anthropic API Key 即可开始使用。

## 项目结构

```
src/
├── components/       # UI 组件
│   ├── Header.tsx        # 顶部导航
│   ├── InputPanel.tsx    # 输入面板（主题、平台、内容类型）
│   ├── HookCard.tsx      # Hook 结果卡片
│   ├── HookGrid.tsx      # 结果网格布局
│   ├── ApiKeyModal.tsx   # API Key 设置弹窗
│   ├── HistoryModal.tsx  # 历史记录弹窗
│   └── Toast.tsx         # 消息提示
├── hooks/            # 自定义 Hooks
│   ├── useGeneration.ts  # AI 生成逻辑
│   ├── useBookmarks.ts   # 收藏管理
│   └── useHistory.ts     # 历史记录管理
├── utils/            # 工具函数
│   ├── api.ts            # Claude API 封装
│   └── storage.ts        # 本地存储封装
├── types/            # TypeScript 类型定义
│   └── index.ts
├── App.tsx           # 根组件
├── main.tsx          # 入口文件
└── index.css         # 全局样式
```

## 开源协议

MIT
