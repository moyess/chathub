import { FetchError } from 'ofetch'
import useSWR from 'swr'
import { getPremiumActivation, validatePremium } from '~services/premium'

export function usePremium() {
  // 🔓 已解锁全部 Premium 功能用于个人使用
  // Modified to bypass premium restrictions for personal use
  const validationQuery = useSWR<{ valid: true } | { valid: false; error?: string }>(
    'premium-validation',
    async () => {
      try {
        return await validatePremium()
      } catch (err) {
        if (err instanceof FetchError) {
          if (err.status === 404) {
            return { valid: false }
          }
          if (err.status === 400) {
            return { valid: false, error: err.data.error }
          }
        }
        throw err
      }
    },
    {
      fallbackData: getPremiumActivation() ? { valid: true } : undefined,
      revalidateOnFocus: false,
      dedupingInterval: 10 * 60 * 1000,
    },
  )

  return {
    activated: true, // 🔓 强制启用 Premium (Force enable premium features)
    isLoading: false,
    error: undefined,
  }
}
