import type { LLMProvider, SentimentType } from "@/types/query-lab"

export const PROVIDER_CONFIG: Record<
  LLMProvider,
  {
    id: LLMProvider
    name: string
    icon: string
    color: string
  }
> = {
  gemini: { id: "gemini", name: "Google Gemini", icon: "G", color: "bg-blue-500" },
  openai: { id: "openai", name: "OpenAI", icon: "O", color: "bg-emerald-500" },
}

export const PROVIDERS = Object.values(PROVIDER_CONFIG)

export const SENTIMENT_CONFIG: Record<
  SentimentType,
  {
    label: string
    color: string
    bg: string
    border: string
  }
> = {
  positive: { label: "Positive", color: "text-green-700", bg: "bg-green-100", border: "border-green-200" },
  negative: { label: "Negative", color: "text-red-700", bg: "bg-red-100", border: "border-red-200" },
  neutral: { label: "Neutral", color: "text-gray-700", bg: "bg-gray-100", border: "border-gray-200" },
}

export const BRAND_HIGHLIGHT_COLOR = "#FEF3C7"
