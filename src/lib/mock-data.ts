import type { TopicCard, TopicDetail, TopicWatch, DeliverySettings } from '@/types'

export const MOCK_WATCHES: TopicWatch[] = [
  {
    id: 'watch-1',
    label: 'AI・生成AI動向',
    keywords: ['生成AI', 'Claude', 'GPT', 'LLM', '大規模言語モデル'],
    sourceUrls: ['https://rss.itmedia.co.jp/rss/2.0/aiplus.xml', 'https://tech.nikkeibp.co.jp/rss'],
    enabled: true,
    scoreThreshold: 60,
  },
  {
    id: 'watch-2',
    label: 'SaaS市場動向',
    keywords: ['SaaS', 'クラウド', 'サブスクリプション', 'ARR', 'MRR'],
    sourceUrls: ['https://www.itmedia.co.jp/rss/2.0/enterprise.xml'],
    enabled: true,
    scoreThreshold: 50,
  },
  {
    id: 'watch-3',
    label: 'ノーコード・自動化ツール',
    keywords: ['ノーコード', 'RPA', '自動化', 'ワークフロー', 'ローコード'],
    sourceUrls: ['https://www.itmedia.co.jp/rss/2.0/enterprise.xml'],
    enabled: false,
    scoreThreshold: 40,
  },
]

export const MOCK_TOPICS: TopicDetail[] = [
  {
    id: 'topic-1',
    title: 'Anthropic、Claude Sonnet 4.6を正式リリース — 推論精度が前世代比40%向上',
    sourceUrl: 'https://www.anthropic.com/news/claude-sonnet-4-6',
    relevanceScore: 95,
    summary: 'AnthropicがClaude Sonnet 4.6をリリース。推論精度・コーディング能力が大幅向上し、APIコストは据え置き。自社サービスへのAI統合コストを抑えつつ品質を向上できる好機。競合サービスのアップデート検討が急務。',
    contentSnippet: 'Anthropic has released Claude Sonnet 4.6, featuring a 40% improvement in reasoning accuracy over its predecessor. The model excels particularly in complex multi-step reasoning tasks and code generation, while maintaining the same API pricing structure...',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'new',
    watchLabel: 'AI・生成AI動向',
    model: 'mock',
  },
  {
    id: 'topic-2',
    title: '国内SaaS市場、2026年に前年比32%成長 — 中小企業導入が牽引',
    sourceUrl: 'https://www.itmedia.co.jp/enterprise/articles/2605/15/saas-growth.html',
    relevanceScore: 88,
    summary: '矢野経済研究所の最新調査によると、2026年国内SaaS市場は前年比32%増。中小企業のDX需要が急拡大しており、月額¥10,000以下の低価格帯サービスの成長が顕著。自社サービスの価格帯設計は競合優位に立てる可能性が高い。',
    contentSnippet: '矢野経済研究所が発表した国内SaaS市場調査によると、2026年の市場規模は前年比32%増となる見通し。特に従業員50名以下の中小企業でのクラウドサービス導入が加速しており...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'new',
    watchLabel: 'SaaS市場動向',
    model: 'mock',
  },
  {
    id: 'topic-3',
    title: 'EU AI Act 第一フェーズ適用開始 — 日本企業への影響と対応策',
    sourceUrl: 'https://www.nikkei.com/article/eu-ai-act-japan-impact',
    relevanceScore: 82,
    summary: 'EU AI Actの第一フェーズが施行。日本のSaaS企業でもEU向けサービス提供時は対応が必要。特に高リスクAIシステムの定義と透明性要件が焦点。自社サービスへの影響度評価と利用規約の見直しを検討すべき段階。',
    contentSnippet: 'EU人工知能規制法（AI Act）の第一フェーズが正式に施行された。日本企業もEU市民向けにAIサービスを提供する場合、同規制の対象となる可能性があり...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'new',
    watchLabel: 'AI・生成AI動向',
    model: 'mock',
  },
  {
    id: 'topic-4',
    title: 'Zapier、AIエージェント連携機能を正式リリース — ノーコード自動化がさらに進化',
    sourceUrl: 'https://zapier.com/blog/ai-agent-integration',
    relevanceScore: 76,
    summary: 'ZapierがAIエージェント連携機能を正式リリース。Claude/GPT連携がノーコードで実現可能に。自社の自動化パイプライン構築コストが下がる一方、有償プランとの機能差分を再確認する必要あり。アップグレードのROIを試算推奨。',
    contentSnippet: 'Zapier has released its AI agent integration feature, making it easier than ever to integrate large language models into automation workflows. The new release includes native connectors for Claude and GPT-4...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: 'read',
    watchLabel: 'ノーコード・自動化ツール',
    model: 'mock',
  },
  {
    id: 'topic-5',
    title: 'Vercel、Next.js 16のロードマップ公開 — React Server Componentsの安定化が焦点',
    sourceUrl: 'https://vercel.com/blog/nextjs-16-roadmap',
    relevanceScore: 65,
    summary: 'VercelがNext.js 16のロードマップを公開。RSCのパフォーマンス改善とデプロイ最適化が主要テーマ。自社サービスの技術スタックに直結するアップデートのため、リリーススケジュールのウォッチを推奨。',
    contentSnippet: 'Vercel has published the roadmap for Next.js 16, focusing on stabilizing React Server Components and improving deployment performance. The update promises significant improvements...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: 'read',
    watchLabel: 'AI・生成AI動向',
    model: 'mock',
  },
  {
    id: 'topic-6',
    title: '中小企業のAI活用率が初めて30%超 — 生産性向上効果の実態調査',
    sourceUrl: 'https://www.meti.go.jp/press/2026/ai-adoption-sme',
    relevanceScore: 79,
    summary: '経産省調査で中小企業のAI活用率が初めて30%を突破。生産性向上効果は平均23%。特に議事録・文書作成・顧客対応での活用が増加。自社サービスのターゲット層の課題感と合致しており、マーケティングメッセージの訴求点に活用可能。',
    contentSnippet: '経済産業省が発表した「2026年中小企業デジタル化実態調査」によると、従業員100名以下の中小企業でのAIツール活用率が初めて30%を超えた...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'new',
    watchLabel: 'SaaS市場動向',
    model: 'mock',
  },
  {
    id: 'topic-7',
    title: 'OpenAI、ChatGPT Enterprise価格を20%値下げ — SaaS競合環境が激化',
    sourceUrl: 'https://openai.com/blog/chatgpt-enterprise-pricing',
    relevanceScore: 71,
    summary: 'OpenAIがChatGPT Enterpriseを20%値下げ。大企業向け市場での価格競争が激化。中小企業向けの日本語特化SaaSは差別化戦略として引き続き有効だが、競合サービスの価格動向の継続監視が必要。',
    contentSnippet: 'OpenAI announced a 20% price reduction for ChatGPT Enterprise, effective immediately. This move is expected to intensify competition in the enterprise AI market...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    status: 'dismissed',
    watchLabel: 'AI・生成AI動向',
    model: 'mock',
  },
  {
    id: 'topic-8',
    title: '日本政府、生成AI活用推進に向けた補助金制度を拡充 — 中小企業向け上限300万円',
    sourceUrl: 'https://www.meti.go.jp/press/2026/ai-subsidy-expansion',
    relevanceScore: 84,
    summary: '経産省が中小企業向けAI活用補助金を拡充。上限300万円、補助率2/3。SaaSツール導入費用も対象に含まれる見込み。自社サービスの営業トークに補助金活用を組み込むことで成約率向上が期待できる。早期に詳細情報を収集し営業資料に反映推奨。',
    contentSnippet: '経済産業省は中小企業向けの生成AI活用推進補助金を大幅拡充すると発表。補助上限を従来の100万円から300万円に引き上げ、クラウドSaaSの導入費用も補助対象に加える方針...',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'new',
    watchLabel: 'SaaS市場動向',
    model: 'mock',
  },
]

export const MOCK_DELIVERY: DeliverySettings = {
  slackWebhookUrl: '',
  emailEnabled: false,
  emailAddress: '',
  notifyAbove: 70,
}

// in-memory mutable store
const topicStore: TopicDetail[] = [...MOCK_TOPICS]
const watchStore: TopicWatch[] = [...MOCK_WATCHES]

export function getTopics(q?: string): TopicDetail[] {
  let items = [...topicStore].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  if (q) items = items.filter(t => t.title.includes(q) || t.summary.includes(q))
  return items
}

export function getTopic(id: string): TopicDetail | null {
  return topicStore.find(t => t.id === id) ?? null
}

export function updateTopicStatus(id: string, status: TopicDetail['status']): boolean {
  const t = topicStore.find(t => t.id === id)
  if (!t) return false
  t.status = status
  return true
}

export function getWatches(): TopicWatch[] {
  return [...watchStore]
}

export function updateWatch(id: string, patch: Partial<TopicWatch>): TopicWatch | null {
  const w = watchStore.find(w => w.id === id)
  if (!w) return null
  Object.assign(w, patch)
  return w
}

export function ingestTopic(topic: Omit<TopicDetail, 'id' | 'status'>): TopicDetail {
  const newTopic: TopicDetail = {
    ...topic,
    id: `topic-${Date.now()}`,
    status: 'new',
  }
  topicStore.unshift(newTopic)
  return newTopic
}

export const IS_MOCK_MODE = !process.env.ANTHROPIC_API_KEY || process.env.PIPELINE_MODE === 'mock'
