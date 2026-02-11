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
      // Extract server detail message if available, otherwise show Korean fallback
      const axiosDetail = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : undefined
      setErrorMessage(
        typeof axiosDetail === 'string'
          ? axiosDetail
          : '회원가입에 실패했습니다. 다시 시도해주세요.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md bg-card shadow-xl border-brand-navy/10">
        <CardHeader className="space-y-4 pb-8">
          {/* GEO Sensor Logo */}
          <div className="flex justify-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-orange via-brand-orange to-brand-navy bg-clip-text text-transparent">
              GEO Sensor
            </h1>
          </div>
          <div className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-brand-navy">회원가입</CardTitle>
            <CardDescription>
              계정을 만들기 위한 정보를 입력하세요
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="space-y-4">
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
                        className="focus-visible:ring-brand-orange"
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
                        className="focus-visible:ring-brand-orange"
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
                        className="focus-visible:ring-brand-orange"
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
                        className="focus-visible:ring-brand-orange"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? '계정 생성 중...' : '계정 만들기'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          {/* Divider for visual consistency */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="text-brand-orange hover:text-brand-orange/90 font-medium underline underline-offset-4 transition-colors"
            >
              로그인
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
