'use client'

import { Check, X } from 'lucide-react'
import { PASSWORD_RULES, validatePassword } from '@/lib/utils/password-validation'
import { cn } from '@/lib/utils'

interface PasswordStrengthIndicatorProps {
  password: string
  showKorean?: boolean
}

export function PasswordStrengthIndicator({
  password,
  showKorean = true
}: PasswordStrengthIndicatorProps) {
  const results = validatePassword(password)

  return (
    <div className="mt-2 space-y-1">
      {PASSWORD_RULES.map((rule) => {
        const passed = results[rule.key]
        return (
          <div
            key={rule.key}
            className={cn(
              'flex items-center gap-2 text-xs transition-colors',
              passed ? 'text-success' : 'text-muted-foreground'
            )}
          >
            {passed ? (
              <Check className="h-3 w-3 text-success" />
            ) : (
              <X className="h-3 w-3 text-destructive" />
            )}
            <span>{showKorean ? rule.labelKo : rule.label}</span>
          </div>
        )
      })}
    </div>
  )
}
