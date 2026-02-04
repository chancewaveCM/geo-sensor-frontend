'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { checkEmailAvailability } from '@/lib/auth'
import { EmailAvailabilityIndicator } from '@/components/auth/EmailAvailabilityIndicator'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator'
import { isPasswordValid, SPECIAL_CHARS } from '@/lib/utils/password-validation'

const registerSchema = z
  .object({
    name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
    email: z.string().email('올바른 이메일 주소를 입력하세요'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .refine((password) => isPasswordValid(password), {
        message: '비밀번호는 모든 요구사항을 충족해야 합니다',
      }),
    confirmPassword: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle')
  const [emailMessage, setEmailMessage] = useState<string>('')
  const { register: registerUser } = useAuth()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Email availability check with debounce
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name !== 'email') return

      const email = value.email || ''

      if (!email || email.length === 0) {
        setEmailStatus('idle')
        setEmailMessage('')
        return
      }

      // Basic email validation before API call
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setEmailStatus('idle')
        setEmailMessage('')
        return
      }

      const timeoutId = setTimeout(async () => {
        setEmailStatus('checking')
        setEmailMessage('확인 중...')

        try {
          const result = await checkEmailAvailability(email)
          setEmailStatus(result.available ? 'available' : 'unavailable')
          setEmailMessage(result.message)
        } catch (error) {
          setEmailStatus('idle')
          setEmailMessage('')
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    })

    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      // Navigation handled by useAuth hook
    } catch (error) {
      console.error('Registration error:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '회원가입에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>
            계정을 만들기 위한 정보를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="홍길동"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이메일</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <EmailAvailabilityIndicator status={emailStatus} message={emailMessage} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호 생성"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <PasswordStrengthIndicator password={field.value} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="비밀번호 확인"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? '계정 생성 중...' : '계정 만들기'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
