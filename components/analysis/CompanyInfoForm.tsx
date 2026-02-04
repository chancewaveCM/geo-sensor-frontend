'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { post } from '@/lib/api-client'
import type { CompanyProfile, CompanyProfileCreate } from '@/types/analysis'

const formSchema = z.object({
  name: z.string().min(1, '기업명을 입력하세요'),
  industry: z.string().min(1, '산업군을 입력하세요'),
  description: z.string().min(10, '기업 설명은 10자 이상 입력하세요'),
  target_audience: z.string().optional(),
  main_products: z.string().optional(),
  competitors: z.string().optional(),
  unique_value: z.string().optional(),
  website_url: z.string().url('올바른 URL을 입력하세요').optional().or(z.literal('')),
})

interface CompanyInfoFormProps {
  onSubmit: (profile: CompanyProfile) => void
}

export function CompanyInfoForm({ onSubmit }: CompanyInfoFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      industry: '',
      description: '',
      target_audience: '',
      main_products: '',
      competitors: '',
      unique_value: '',
      website_url: '',
    },
  })

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const profile = await post<CompanyProfile>('/api/v1/company-profiles/', data)
      onSubmit(profile)
    } catch (error) {
      console.error('Failed to create company profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>기업명 *</FormLabel>
                <FormControl>
                  <Input placeholder="예: 삼성전자" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>산업군 *</FormLabel>
                <FormControl>
                  <Input placeholder="예: 전자제품, IT, 반도체" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>기업 설명 *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="기업에 대한 간략한 설명을 입력하세요"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>최소 10자 이상 입력하세요</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="target_audience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>타겟 고객</FormLabel>
                <FormControl>
                  <Input placeholder="예: 20-40대 직장인" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="main_products"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주요 제품/서비스</FormLabel>
                <FormControl>
                  <Input placeholder="예: 스마트폰, TV, 가전제품" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="competitors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주요 경쟁사</FormLabel>
                <FormControl>
                  <Input placeholder="예: Apple, LG전자" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unique_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>차별화 포인트</FormLabel>
                <FormControl>
                  <Input placeholder="예: 혁신적인 기술력" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="website_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>웹사이트 URL</FormLabel>
              <FormControl>
                <Input placeholder="https://www.example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '저장 중...' : '다음 단계로'}
        </Button>
      </form>
    </Form>
  )
}
