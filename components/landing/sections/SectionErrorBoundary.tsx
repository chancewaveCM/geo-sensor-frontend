'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

interface SectionErrorBoundaryProps {
  children: ReactNode
  sectionName: string
}

interface SectionErrorBoundaryState {
  hasError: boolean
}

export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  state: SectionErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): SectionErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Landing Section Error] ${this.props.sectionName}`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="px-4 py-12 md:px-6">
          <div className="mx-auto w-full max-w-[1200px] rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="text-sm font-semibold text-rose-700">
              {this.props.sectionName} 섹션을 불러오는 중 문제가 발생했습니다.
            </p>
            <p className="mt-1 text-xs text-rose-600">
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}
