import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'

import { verifyOtpServerFn, resendOtpServerFn } from '@/server/auth'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import * as m from '@/paraglide/messages'

export const Route = createFileRoute('/verify-otp')({
  validateSearch: (search: Record<string, unknown>) => ({
    email: typeof search.email === 'string' ? search.email : '',
  }),

  component: VerifyOtpPage,
})

function VerifyOtpPage() {
  const navigate = useNavigate()

  const { email } = Route.useSearch()

  const verifyOtp = useServerFn(verifyOtpServerFn)
  const resendOtp = useServerFn(resendOtpServerFn)

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,

    onSuccess: async () => {
      await navigate({
        to: '/login',
      })
    },
  })

  const resendMutation = useMutation({
    mutationFn: resendOtp,
  })

  const form = useForm({
    defaultValues: {
      otp: '',
    },

    onSubmit: async ({ value }) => {
      verifyMutation.mutate({
        data: {
          email,
          otp: value.otp,
        },
      })
    },
  })

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{m.verify_account()}</h1>

          <p className="mt-2 text-sm">{m.otp_instruction()}</p>

          <p className="mt-1 text-sm font-medium">{email}</p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field name="otp">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>{m.otp()}</Label>

                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="123456"
                />
              </div>
            )}
          </form.Field>

          {verifyMutation.isError && (
            <p className="text-sm text-red-500">
              {verifyMutation.error instanceof Error
                ? verifyMutation.error.message
                : m.verification_failed()}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={verifyMutation.isPending}
          >
            {verifyMutation.isPending ? m.verifying() : m.verify_button()}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={resendMutation.isPending || !email}
            onClick={() => {
              resendMutation.mutate({
                data: {
                  email,
                },
              })
            }}
          >
            {resendMutation.isPending ? m.sending() : m.resend_otp()}
          </Button>

          {resendMutation.isSuccess && (
            <p className="text-sm">{m.otp_sent()}</p>
          )}
        </form>
      </div>
    </div>
  )
}
