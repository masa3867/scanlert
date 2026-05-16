export type TopicStatus = 'new' | 'read' | 'dismissed'

export type TopicCard = {
  id: string
  title: string
  sourceUrl: string
  relevanceScore: number
  summary: string
  createdAt: string
  status: TopicStatus
  watchLabel?: string
}

export type TopicDetail = TopicCard & {
  contentSnippet: string
  model?: string
}

export type TopicWatch = {
  id: string
  label: string
  keywords: string[]
  sourceUrls: string[]
  enabled: boolean
  scoreThreshold: number
}

export type DeliverySettings = {
  slackWebhookUrl: string
  emailEnabled: boolean
  emailAddress: string
  notifyAbove: number
}

export type PipelineMode = 'mock' | 'production'
