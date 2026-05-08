// ===== 枚举与常量 =====

export type Platform = 'xiaohongshu' | 'douyin' | 'bilibili';
export type ContentType = 'video' | 'image-text' | 'product-ad' | 'tutorial' | 'opinion';
export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export const HOOK_STYLES = [
  '悬念型','共鸣型','反差型','痛点型',
  '数据型','故事型','挑战型','幽默型',
  '权威型','好奇型','恐惧型','利益型',
] as const;

export const PLATFORM_LABELS: Record<Platform, string> = {
  xiaohongshu: '小红书', douyin: '抖音', bilibili: 'B站',
};
export const PLATFORM_ICONS: Record<Platform, string> = {
  xiaohongshu: '📕', douyin: '🎵', bilibili: '📺',
};
export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  video: '视频', 'image-text': '图文', 'product-ad': '产品广告',
  tutorial: '教程', opinion: '观点贴',
};
export const CONTENT_TYPE_ICONS: Record<ContentType, string> = {
  video: '🎬', 'image-text': '📝', 'product-ad': '📢',
  tutorial: '📚', opinion: '💡',
};

// ===== 数据实体 =====

export interface GenerationRequest {
  topic: string;
  platform: Platform;
  contentType: ContentType;
}

export interface HookResult {
  id: string;
  hook: string;
  style: string;
  score: number;
  reason: string;
}

export interface GenerationRecord {
  id: string;
  request: GenerationRequest;
  results: HookResult[];
  timestamp: number;
}

// ===== 结构化错误 =====

export type AppErrorType = 'API_KEY_MISSING' | 'API_KEY_INVALID' | 'API_NETWORK' | 'API_PARSE' | 'API_SERVER';

export interface AppError {
  type: AppErrorType;
  message: string;   // 用户可见的中文消息
  detail?: string;   // 调试用
}
