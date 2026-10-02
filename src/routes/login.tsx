import {
  createFileRoute,
  Link,
  redirect,
  useNavigate,
} from '@tanstack/react-router'

import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import { loginSchema } from '@/schema/auth'
import { loginServerFn } from '@/server/auth'
import { authKeys, currentUserQueryOptions } from '@/queries/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import * as m from '@/paraglide/messages'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(
      currentUserQueryOptions(),
    )

    if (user) {
      throw redirect({
        to: '/courses',
      })
    }
  },

  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const login = useServerFn(loginServerFn)

  const loginMutation = useMutation({
    mutationFn: login,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: authKeys.currentUser(),
      })

      await navigate({
        to: '/courses',
      })
    },
  })

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    validators: {
      onChange: loginSchema,
    },

    onSubmit: async ({ value }) => {
      loginMutation.mutate({
        data: value,
      })
    },
  })

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{m.login_title()}</h1>
        </div>

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
                  name={field.name}
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
                  name={field.name}
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

          {loginMutation.isError && (
            <p className="text-sm text-red-500">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : m.invalid_login()}
            </p>
          )}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting || loginMutation.isPending}
              >
                {loginMutation.isPending ? m.logging_in() : m.login_button()}
              </Button>
            )}
          </form.Subscribe>

          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="underline">
              {m.forgot_password()}
            </Link>

            <span>
              {m.no_account()}{' '}
              <Link to="/register" className="underline">
                {m.sign_up()}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
