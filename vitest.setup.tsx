import { vi } from 'vitest'

// Next.jsのイメージオプティマイゼーション機能のモック
vi.mock('next/image', () => ({
  default: vi.fn().mockImplementation(({ src, alt }) => <img src={src} alt={alt} />),
}))

// next/routerのモック
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    }
  },
  usePathname() {
    return '/'
  },
}))