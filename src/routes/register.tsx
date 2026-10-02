import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import { registerSchema } from '@/schema/auth'
import { registerServerFn } from '@/server/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import * as m from '@/paraglide/messages'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()

  const register = useServerFn(registerServerFn)

  const registerMutation = useMutation({
    mutationFn: register,

    onSuccess: async (_, variables) => {
      await navigate({
        to: '/verify-otp',
        search: {
          email: variables.data.email,
        },
      })
    },
  })

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validators: {
      onChange: registerSchema,
    },

    onSubmit: async ({ value }) => {
      registerMutation.mutate({
        data: value,
      })
    },
  })

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="w-full space-y-6">
        <h1 className="text-3xl font-bold">{m.create_account()}</h1>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{m.name()}</Label>

                <Input
                  id={field.name}
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

          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{m.password()}</Label>

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

          {registerMutation.isError && (
            <p className="text-sm text-red-500">
              {registerMutation.error instanceof Error
                ? registerMutation.error.message
                : m.registration_failed()}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending
              ? m.creating_account()
              : m.create_account()}
          </Button>

          <p className="text-center text-sm">
            {m.already_have_account()}{' '}
            <Link to="/login" className="underline">
              {m.login()}
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
