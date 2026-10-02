import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import { resetPasswordSchema } from '@/schema/auth'
import { resetPasswordServerFn } from '@/server/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import * as m from '@/paraglide/messages'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === 'string' ? search.email : '',
  }),

  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()

  const { email } = Route.useSearch()

  const resetPassword = useServerFn(resetPasswordServerFn)

  const resetMutation = useMutation({
    mutationFn: resetPassword,

    onSuccess: async () => {
      await navigate({
        to: '/login',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      email,
      password: '',
      confirmPassword: '',
    },

    validators: {
      onChange: resetPasswordSchema,
    },

    onSubmit: async ({ value }) => {
      resetMutation.mutate({
        data: value,
      })
    },
  })

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{m.reset_password_title()}</h1>

          <p className="mt-2 text-sm">
            {m.reset_password_for()} {email}
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()

            form.handleSubmit()
          }}
        >
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{m.new_password()}</Label>

                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />

                {!field.state.meta.isValid && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors
                      .map((error) => error?.message)
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="confirmPassword">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{m.confirm_password()}</Label>

                <Input
                  id={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />

                {!field.state.meta.isValid && (
                  <p className="text-sm text-red-500">
                    {field.state.meta.errors
                      .map((error) => error?.message)
                      .join(', ')}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {resetMutation.isError && (
            <p className="text-sm text-red-500">
              {resetMutation.error instanceof Error
                ? resetMutation.error.message
                : m.reset_password_failed()}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending
              ? m.resetting()
              : m.reset_password_button()}
          </Button>
        </form>
      </div>
    </div>
  )
}
