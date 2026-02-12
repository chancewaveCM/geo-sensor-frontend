'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FinalCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [feedbackMessage, setFeedbackMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === 'submitting') return

    const normalizedEmail = email.trim()
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)

    if (!isValidEmail) {
      setStatus('error')
      setFeedbackMessage('유효한 업무용 이메일을 입력해주세요.')
      return
    }

    setStatus('submitting')
    setFeedbackMessage('요청을 처리하고 있습니다...')

    try {
      // API 연동 전까지 UX 검증용 비동기 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 700))
      setStatus('success')
      setFeedbackMessage('얼리 액세스 요청이 접수되었습니다.')
    } catch {
      setStatus('error')
      setFeedbackMessage('요청 처리에 실패했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <section className="px-4 pb-16 md:px-6 md:pb-20">
      <div className="mx-auto w-full max-w-[1200px] rounded-3xl bg-gray-900 px-6 py-12 text-gray-100 dark:bg-muted dark:text-foreground md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-muted-foreground">Early Access</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white dark:text-foreground md:text-4xl">
          AI 추천 결과에
          <br />
          당신의 브랜드를 올리세요
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 dark:text-muted-foreground md:text-base">
          이메일을 남겨주시면 얼리 액세스와 온보딩 가이드를 보내드립니다. 200팀 한정으로 운영 중입니다.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="work@email.com"
            aria-invalid={status === 'error'}
            disabled={status === 'submitting' || status === 'success'}
            className="h-11 rounded-full border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500 dark:border-border-strong dark:bg-background-subtle dark:text-foreground dark:placeholder:text-muted-foreground dark:focus-visible:ring-ring"
          />
          <Button
            type="submit"
            disabled={status === 'submitting' || status === 'success'}
            className={`h-11 rounded-full bg-brand-orange px-6 text-white hover:bg-brand-orange-hover ${
              status === 'idle' ? 'animate-pulse-subtle' : ''
            }`}
          >
            {status === 'submitting' && '처리 중...'}
            {status === 'success' && '요청 접수 완료'}
            {status === 'error' && '다시 시도하기'}
            {status === 'idle' && '얼리 액세스 신청'}
            {status !== 'success' && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
        <p
          aria-live="polite"
          className={`mt-3 text-sm ${
            status === 'error' ? 'text-rose-300 dark:text-destructive' : 'text-gray-300 dark:text-muted-foreground'
          }`}
        >
          {feedbackMessage}
        </p>
      </div>
    </section>
  )
}
