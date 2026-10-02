import { queryOptions } from '@tanstack/react-query'

import { getCurrentUserServerFn } from '@/server/auth'

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
}

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: authKeys.currentUser(),

    queryFn: async () => {
      return getCurrentUserServerFn()
    },
  })
}
