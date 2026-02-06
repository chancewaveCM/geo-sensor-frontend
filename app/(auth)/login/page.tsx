'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
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

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력하세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { login } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      await login(data)
      // Navigation handled by useAuth hook
    } catch (error) {
      console.error('Login error:', error)
      // Extract server detail message if available, otherwise show Korean fallback
      const axiosDetail = (error as any)?.response?.data?.detail
      setErrorMessage(
        typeof axiosDetail === 'string'
          ? axiosDetail
          : '로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.'
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
            <CardTitle className="text-2xl font-bold text-brand-navy">로그인</CardTitle>
            <CardDescription>
              계정에 로그인하세요
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
                        placeholder="비밀번호 입력"
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
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          {/* Divider for potential social login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            계정이 없으신가요?{' '}
            <Link
              href="/register"
              className="text-brand-orange hover:text-brand-orange/90 font-medium underline underline-offset-4 transition-colors"
            >
              회원가입
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
