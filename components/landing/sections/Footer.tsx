import Link from 'next/link'
import { Linkedin, Mail, MessageCircle, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 px-4 py-12 text-gray-300 md:px-6">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-white">
              GEO Sensor
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              AI 응답에서 브랜드 인용률을 측정하고, 실행 가능한 GEO 전략으로 연결합니다.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all hover:scale-110 hover:text-white"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all hover:scale-110 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="mailto:team@geosensor.ai"
                aria-label="이메일"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all hover:scale-110 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="/#faq"
                aria-label="커뮤니티"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-700 text-gray-400 transition-all hover:scale-110 hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">제품</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="#features" className="block text-gray-400 transition-colors hover:text-white">기능</a>
              <a href="#providers" className="block text-gray-400 transition-colors hover:text-white">분석 모델</a>
              <a href="#case-studies" className="block text-gray-400 transition-colors hover:text-white">캠페인 관리</a>
              <a href="/query-lab" className="block text-gray-400 transition-colors hover:text-white">API 문서</a>
              <a href="/register" className="block text-gray-400 transition-colors hover:text-white">요금제</a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">회사</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="/#features" className="block text-gray-400 transition-colors hover:text-white">소개</a>
              <a href="/#case-studies" className="block text-gray-400 transition-colors hover:text-white">블로그</a>
              <a href="/register" className="inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white">
                채용
                <span className="rounded-full bg-brand-orange px-1.5 py-0.5 text-[10px] font-semibold text-white">hiring</span>
              </a>
              <a href="/#faq" className="block text-gray-400 transition-colors hover:text-white">문의하기</a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">리소스</p>
            <div className="mt-3 space-y-2 text-sm">
              <a href="#faq" className="block text-gray-400 transition-colors hover:text-white">FAQ</a>
              <a href="#how-it-works" className="block text-gray-400 transition-colors hover:text-white">GEO 가이드</a>
              <a href="#providers" className="block text-gray-400 transition-colors hover:text-white">SEO vs GEO 비교</a>
              <a href="#case-studies" className="block text-gray-400 transition-colors hover:text-white">도입 사례</a>
              <a href="/#faq" className="block text-gray-400 transition-colors hover:text-white">커뮤니티</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-gray-800 pt-5 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 GEO Sensor. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="/#faq" className="hover:text-gray-300">이용약관</a>
            <span>·</span>
            <a href="/#faq" className="hover:text-gray-300">개인정보처리방침</a>
            <span>·</span>
            <a href="/#faq" className="hover:text-gray-300">쿠키 정책</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
