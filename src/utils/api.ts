import type { GenerationRequest, HookResult, HookStyle, AppError } from '../types';
import { getApiKey } from './storage';

const SYSTEM_PROMPT = `你是中文社交媒体爆款内容专家，专精为小红书/抖音/B站创作高点击率的开头Hook。

风格分类与定义：
- 悬念型：制造信息缺口，"你一定不会相信..."
- 共鸣型：精准描述用户痛点，"每个XX的人都有这种感觉"
- 反差型：先抛常见认知再推翻，"99%的人以为X，其实Y"
- 痛点型：直面用户焦虑，"加班到凌晨还是做不完，问题出在哪"
- 数据型：用数字建立可信度，"我分析了1000条爆款后发现..."
- 故事型：用微型叙事引入，"上周我遇到一个客户，他说..."
- 挑战型：发起一个用户想完成的挑战，"7天不用手机，结果..."
- 幽默型：用轻松调侃拉近距离，"自从做了自媒体，我妈觉得我..."
- 权威型：建立专业信任感，"做了10年PR，我只想说..."
- 好奇型：激发探索欲，"你不知道的X个隐藏功能"
- 恐惧型：提示错过/损失，"如果你还不知道这个，可能已经落后了"
- 利益型：直接承诺价值，"学会这招，你的转化率翻倍"

评分标准：
- 90-100分：忍不住点开，强烈情绪/好奇/利益驱动
- 75-89分：有吸引力，但冲击力稍逊
- 60-74分：中规中矩
要求至少5条达到85分以上。

输出必须是合法JSON数组，不含任何其他文字：
[{"hook":"文案(30字内)","style":"风格标签","score":95,"reason":"推荐理由(20字内)"},...]
10条Hook风格各不相同，真实接地气有网感。`;

function buildUserPrompt(req: GenerationRequest): string {
  const platformDesc: Record<string, string> = {
    xiaohongshu: '小红书（精致审美，真实种草语气，用户喜欢干货和真实体验分享）',
    douyin: '抖音（快节奏，强情绪，黄金3秒法则，口语化表达优先）',
    bilibili: 'B站（Z世代社区，有梗有趣，专业但不严肃）',
  };
  const typeDesc: Record<string, string> = {
    video: '视频脚本开头', 'image-text': '图文笔记标题',
    'product-ad': '产品广告开头', tutorial: '教程/攻略开头', opinion: '观点/评论开头',
  };
  return `主题：${req.topic}\n平台：${platformDesc[req.platform]}\n内容类型：${typeDesc[req.contentType]}\n\n请生成10个不同风格的爆款Hook。融入平台特性，紧扣主题。`;
}

export async function generateHooks(req: GenerationRequest): Promise<HookResult[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    const err: AppError = { type: 'API_KEY_MISSING', message: '请先设置 API Key' };
    throw err;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.9,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(req) },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.status === 401) {
      const err: AppError = { type: 'API_KEY_INVALID', message: 'API Key 无效，请重新设置' };
      throw err;
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      const err: AppError = { type: 'API_SERVER', message: `服务器错误 (${res.status})，请稍后重试`, detail };
      throw err;
    }

    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content || '';
    return parseHooks(text);
  } catch (e: unknown) {
    clearTimeout(timer);
    if ((e as AppError).type) throw e;
    if (e instanceof DOMException && e.name === 'AbortError') {
      const err: AppError = { type: 'API_NETWORK', message: '请求超时，请检查网络后重试' };
      throw err;
    }
    const err: AppError = { type: 'API_NETWORK', message: '网络连接失败，请检查网络' };
    throw err;
  }
}

function parseHooks(text: string): HookResult[] {
  // Tier 1: direct JSON parse
  try {
    const parsed = JSON.parse(text.trim());
    const arr = Array.isArray(parsed) ? parsed : parsed.hooks ?? parsed.results ?? [];
    if (Array.isArray(arr) && arr.length > 0) return validateAndFormat(arr);
  } catch { /* fall through */ }

  // Tier 2: regex extract array
  const match = text.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const arr = JSON.parse(match[0]);
      if (Array.isArray(arr) && arr.length > 0) return validateAndFormat(arr);
    } catch { /* fall through */ }
  }

  // Tier 3: extract individual objects
  const objects = text.match(/\{[^}]+\}/g);
  if (objects) {
    const arr = objects.map(o => { try { return JSON.parse(o); } catch { return null; } }).filter(Boolean);
    if (arr.length > 0) return validateAndFormat(arr as any[]);
  }

  const err: AppError = { type: 'API_PARSE', message: 'AI 返回格式异常，请重试', detail: text.slice(0, 200) };
  throw err;
}

function validateAndFormat(arr: any[]): HookResult[] {
  const results: HookResult[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!item.hook || !item.style || typeof item.score !== 'number' || !item.reason) continue;
    results.push({
      id: `hook-${Date.now()}-${i}`,
      hook: String(item.hook).slice(0, 30),
      style: String(item.style) as HookStyle,
      score: Math.min(100, Math.max(1, Math.round(Number(item.score)))),
      reason: String(item.reason).slice(0, 20),
    });
  }
  if (results.length === 0) {
    const err: AppError = { type: 'API_PARSE', message: 'AI 未返回有效 Hook，请重试', detail: JSON.stringify(arr).slice(0, 200) };
    throw err;
  }
  return results;
}
