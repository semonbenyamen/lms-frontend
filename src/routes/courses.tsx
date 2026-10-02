import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { currentUserQueryOptions } from '@/queries/auth'

export const Route = createFileRoute('/courses')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      currentUserQueryOptions(),
    )

    if (!user) {
      throw redirect({
        to: '/login',
      })
    }
  },

  component: CoursesLayout,
})

function CoursesLayout() {
  return <Outlet />
}
