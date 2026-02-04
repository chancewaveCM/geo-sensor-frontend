// 비밀번호 규칙 정의 (백엔드 schemas/user.py와 동일하게 맞춤)
export const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?"

export interface PasswordRule {
  key: string
  label: string
  labelKo: string
  test: (password: string) => boolean
}

export const PASSWORD_RULES: PasswordRule[] = [
  {
    key: 'length',
    label: 'At least 8 characters',
    labelKo: '8자 이상',
    test: (p) => p.length >= 8
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    labelKo: '대문자 포함',
    test: (p) => /[A-Z]/.test(p)
  },
  {
    key: 'number',
    label: 'One number',
    labelKo: '숫자 포함',
    test: (p) => /\d/.test(p)
  },
  {
    key: 'special',
    label: 'One special character',
    labelKo: '특수문자 포함',
    test: (p) => new RegExp(`[${SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(p)
  },
]

export function validatePassword(password: string): Record<string, boolean> {
  return PASSWORD_RULES.reduce((acc, rule) => {
    acc[rule.key] = rule.test(password)
    return acc
  }, {} as Record<string, boolean>)
}

export function isPasswordValid(password: string): boolean {
  return PASSWORD_RULES.every(rule => rule.test(password))
}
