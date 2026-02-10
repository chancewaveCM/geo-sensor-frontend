'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Loader2 } from 'lucide-react'
import { post } from '@/lib/api-client'

interface AvatarUploadProps {
  currentUrl: string | null
  onUploaded: (url: string) => void
}

export function AvatarUpload({ currentUrl, onUploaded }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      alert('이미지는 2MB 이하여야 합니다.')
      return
    }

    setUploading(true)
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const contentType = file.type || 'image/png'
      const result = await post<{ avatar_url: string }>('/api/v1/auth/me/avatar', {
        avatar_data: base64,
        content_type: contentType,
      })
      onUploaded(result.avatar_url)
    } catch {
      alert('업로드에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
        {currentUrl ? (
          <img src={currentUrl} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
            ?
          </div>
        )}
      </div>
      <div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Camera className="mr-2 h-4 w-4" />
          )}
          사진 변경
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, GIF, WebP (최대 2MB)</p>
      </div>
    </div>
  )
}
