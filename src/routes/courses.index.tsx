import { useState } from 'react'

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useServerFn } from '@tanstack/react-start'

import { fetchCourses } from '@/api/courses'
import { Button } from '@/components/ui/button'

import { logoutServerFn } from '@/server/auth'
import { authKeys } from '@/queries/auth'

import * as m from '@/paraglide/messages'

export const Route = createFileRoute('/courses/')({
  component: CoursesPage,
})

function CoursesPage() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en')

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const logout = useServerFn(logoutServerFn)

  const logoutMutation = useMutation({
  mutationFn: logout,

  onSuccess: async () => {
    queryClient.setQueryData(
      authKeys.currentUser(),
      null,
    )

    await navigate({
      to: '/login',
    })
  },
})

  const {
    data: courses,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  const messageOptions = { locale }

  if (isPending) {
    return (
      <div className="p-6">
        <p>{m.loading_courses({}, messageOptions)}</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">
          {m.failed_load_courses({}, messageOptions)}
        </p>
      </div>
    )
  }

  return (
    <div
      className="mx-auto max-w-4xl p-6"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {m.courses_title({}, messageOptions)}
          </h1>

          <p className="mt-1 text-gray-500">
            {m.manage_courses({}, messageOptions)}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setLocale((currentLocale) =>
                currentLocale === 'en' ? 'ar' : 'en',
              )
            }}
          >
            {locale === 'en' ? 'العربية' : 'English'}
          </Button>

          <Button asChild>
            <Link to="/courses/new">{m.add_course({}, messageOptions)}</Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              logoutMutation.mutate()
            }}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending
              ? m.logging_out({}, messageOptions)
              : m.logout({}, messageOptions)}
          </Button>
        </div>
      </div>

      {logoutMutation.isError && (
        <p className="mb-4 text-sm text-red-500">
          {logoutMutation.error instanceof Error
            ? logoutMutation.error.message
            : m.logout_failed({}, messageOptions)}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course.id} className="rounded-lg border p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{course.title}</h2>

            <p className="mt-2 text-gray-600">
              {m.instructor({}, messageOptions)}: {course.instructor}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
