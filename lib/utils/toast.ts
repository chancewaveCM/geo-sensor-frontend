/**
 * Toast notification messages in Korean for consistent UX
 */
export const toastMessages = {
  success: {
    save: '저장되었습니다',
    delete: '삭제되었습니다',
    create: '생성되었습니다',
    update: '업데이트되었습니다',
    copy: '복사되었습니다',
    send: '전송되었습니다',
  },
  error: {
    generic: '오류가 발생했습니다. 다시 시도해주세요',
    network: '네트워크 오류가 발생했습니다',
    notFound: '요청한 데이터를 찾을 수 없습니다',
    unauthorized: '권한이 없습니다',
    validation: '입력값을 확인해주세요',
    timeout: '요청 시간이 초과되었습니다',
  },
  info: {
    processing: '처리 중입니다...',
    loading: '로딩 중입니다...',
  },
  warning: {
    unsavedChanges: '저장하지 않은 변경사항이 있습니다',
    confirmDelete: '정말 삭제하시겠습니까?',
  },
} as const

/**
 * Get a formatted error message from an error object
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return toastMessages.error.generic
}
