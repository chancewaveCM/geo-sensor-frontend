'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function FinalCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <section className="px-4 pb-16 md:px-6 md:pb-20">
      <div className="mx-auto w-full max-w-[1200px] rounded-3xl bg-gray-900 px-6 py-12 text-gray-100 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Early Access</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
          AI 추천 결과에
          <br />
          당신의 브랜드를 올리세요
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300 md:text-base">
          이메일을 남겨주시면 얼리 액세스와 온보딩 가이드를 보내드립니다. 200팀 한정으로 운영 중입니다.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="work@email.com"
            className="h-11 rounded-full border-gray-700 bg-gray-800 text-white placeholder:text-gray-500 focus-visible:ring-gray-500"
          />
          <Button
            type="submit"
            className="h-11 rounded-full bg-brand-orange px-6 text-white hover:bg-brand-orange-hover animate-pulse-subtle"
          >
            {submitted ? '요청이 접수되었습니다' : '얼리 액세스 신청'}
            {!submitted && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </form>
      </div>
    </section>
  )
}
