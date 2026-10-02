import { createServerFn } from '@tanstack/react-start'

import {
  loginSchema,
  registerSchema,
  otpSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/schema/auth'

import { authService } from '@/api/services/auth.service'

export const loginServerFn = createServerFn({
  method: 'POST',
})
  .validator(loginSchema)
  .handler(async ({ data }) => {
    return authService.login(data)
  })

export const registerServerFn = createServerFn({
  method: 'POST',
})
  .validator(registerSchema)
  .handler(async ({ data }) => {
    return authService.register(data)
  })

export const verifyOtpServerFn = createServerFn({
  method: 'POST',
})
  .validator(otpSchema)
  .handler(async ({ data }) => {
    return authService.verifyOtp({
      email: data.email,
      otp: data.otp,
    })
  })

export const resendOtpServerFn = createServerFn({
  method: 'POST',
})
  .validator(resendOtpSchema)
  .handler(async ({ data }) => {
    return authService.resendOtp(data.email)
  })

export const forgotPasswordServerFn = createServerFn({
  method: 'POST',
})
  .validator(forgotPasswordSchema)
  .handler(async ({ data }) => {
    return authService.forgotPassword(data)
  })

export const resetPasswordServerFn = createServerFn({
  method: 'POST',
})
  .validator(resetPasswordSchema)
  .handler(async ({ data }) => {
    return authService.resetPassword({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
  })

export const getCurrentUserServerFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return authService.getCurrentUser()
})

export const logoutServerFn = createServerFn({
  method: 'POST',
}).handler(async () => {
  await authService.logout()

  return {
    success: true,
  }
})
