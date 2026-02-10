# Component Usage Guide

> GEO Sensor Platform 컴포넌트 사용 가이드라인
> Last Updated: 2026-02-10

이 문서는 코드 일관성을 유지하기 위해 **하면 안 되는 패턴**과 올바른 대안을 정리합니다.

---

## 1. 인라인 빈 상태 대신 `<EmptyState />` 사용

### ❌ 하면 안 되는 패턴
```tsx
// 각 페이지마다 다른 빈 상태 UI 구현
<div className="flex flex-col items-center p-8 border-dashed border">
  <p>데이터가 없습니다</p>
</div>
```

### ✅ 올바른 패턴
```tsx
import { EmptyState } from '@/components/ui/empty-state'

<EmptyState
  icon={<FileSearch className="h-6 w-6" />}
  title="데이터가 없습니다"
  description="새로운 분석을 시작해보세요"
  action={<Button>분석 시작</Button>}
/>
```

**위치**: `components/ui/empty-state.tsx`
**Props**: `icon?`, `title`, `description?`, `action?`, `className?`

---

## 2. raw `animate-pulse` 대신 Skeleton 컴포넌트 사용

### ❌ 하면 안 되는 패턴
```tsx
<div className="animate-pulse bg-gray-200 h-32 rounded" />
```

### ✅ 올바른 패턴
```tsx
import { Skeleton } from '@/components/ui/skeleton'

<Skeleton className="h-32 w-full" />
```

**위치**: `components/ui/skeleton.tsx`
**참고**: 차트 로딩에는 높이를 `h-[300px]`로 맞추기

---

## 3. 하드코딩 hex 색상 대신 CSS variable 사용

### ❌ 하면 안 되는 패턴
```tsx
<Line stroke="#F97316" />
<div style={{ color: '#ef4444' }} />
```

### ✅ 올바른 패턴
```tsx
import { getTokenColor } from '@/lib/design-tokens'

<Line stroke={getTokenColor('--chart-1')} />
```

**차트 토큰 목록**:
- `--chart-1`: Brand Orange (주요 데이터)
- `--chart-2`: Navy/Blue (보조 데이터)
- `--chart-3`: Green (성공/긍정)
- `--chart-4`: Purple (카테고리)
- `--chart-5`: Red (실패/부정)

---

## 4. raw `<select>` 대신 shadcn `<Select />` 사용

### ❌ 하면 안 되는 패턴
```tsx
<select className="border rounded p-2">
  <option value="1">Option 1</option>
</select>
```

### ✅ 올바른 패턴
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

**위치**: `components/ui/select.tsx`

---

## 5. 인라인 에러 메시지 대신 일관된 에러 상태 사용

### ❌ 하면 안 되는 패턴
```tsx
{error && <p className="text-red-500">오류가 발생했습니다</p>}
```

### ✅ 올바른 패턴
```tsx
import { EmptyState } from '@/components/ui/empty-state'
import { AlertCircle } from 'lucide-react'

<EmptyState
  icon={<AlertCircle className="h-6 w-6 text-destructive" />}
  title="오류가 발생했습니다"
  description={error.message}
  action={<Button variant="outline" onClick={refetch}>다시 시도</Button>}
/>
```

**참고**: 전용 ErrorState 컴포넌트가 없으므로, EmptyState를 에러 아이콘과 함께 활용

---

## 6. 상태 뱃지 하드코딩 대신 Badge variant 사용

### ❌ 하면 안 되는 패턴
```tsx
<span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
  완료
</span>
```

### ✅ 올바른 패턴
```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="default">완료</Badge>
<Badge variant="secondary">대기</Badge>
<Badge variant="destructive">실패</Badge>
<Badge variant="outline">초안</Badge>
```

**위치**: `components/ui/badge.tsx`
**Variants**: `default`, `secondary`, `destructive`, `outline`

---

## 7. 페이지 헤더 직접 작성 대신 일관된 패턴 사용

### ❌ 하면 안 되는 패턴
```tsx
<div className="mb-6">
  <h1 className="text-2xl font-bold">페이지 제목</h1>
  <p className="text-muted-foreground">설명</p>
</div>
```

### ✅ 올바른 패턴
```tsx
<div className="mb-6 space-y-1">
  <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
  {description && (
    <p className="text-sm text-muted-foreground">{description}</p>
  )}
</div>
```

**참고**: 전용 PageHeader 컴포넌트가 아직 없으므로, 위 패턴을 일관되게 사용. 향후 `components/ui/page-header.tsx` 컴포넌트 추가 예정.

---

## 일반 원칙

1. **shadcn/ui 우선**: `components/ui/`에 있는 컴포넌트를 먼저 확인
2. **CSS Variable 우선**: 색상은 Tailwind 클래스 또는 CSS 변수 사용
3. **한국어 라벨**: 모든 사용자 대면 텍스트는 한국어로 작성
4. **getTokenColor()**: 차트/그래프에서 동적 색상 접근 시 사용
5. **일관된 spacing**: `space-y-4`, `gap-4`, `p-6` 패턴 준수
