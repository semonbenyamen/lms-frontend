import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import { forgotPasswordSchema } from '@/schema/auth'
import { forgotPasswordServerFn } from '@/server/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import * as m from '@/paraglide/messages'

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()

  const forgotPassword = useServerFn(forgotPasswordServerFn)

  const forgotMutation = useMutation({
    mutationFn: forgotPassword,

    onSuccess: async (_, variables) => {
      await navigate({
        to: '/reset-password',
        search: {
          email: variables.data.email,
        },
      })
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
    },

    validators: {
      onChange: forgotPasswordSchema,
    },

    onSubmit: async ({ value }) => {
      forgotMutation.mutate({
        data: value,
      })
    },
  })

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="w-full space-y-6">
        <h1 className="text-3xl font-bold">{m.forgot_password_title()}</h1>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()

            form.handleSubmit()
          }}
        >
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{m.email()}</Label>

                <Input
                  id={field.name}
                  type="email"
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

          {forgotMutation.isError && (
            <p className="text-sm text-red-500">
              {forgotMutation.error instanceof Error
                ? forgotMutation.error.message
                : m.something_went_wrong()}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? m.checking() : m.continue()}
          </Button>
        </form>
      </div>
    </div>
  )
}
