import * as v from 'valibot'

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email('Please enter a valid email address')),

  password: v.pipe(
    v.string(),
    v.minLength(8, 'Password must be at least 8 characters'),
  ),
})

export const registerSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.string(),
      v.minLength(2, 'Name must be at least 2 characters'),
    ),

    email: v.pipe(v.string(), v.email('Please enter a valid email address')),

    password: v.pipe(
      v.string(),
      v.minLength(8, 'Password must be at least 8 characters'),
    ),

    confirmPassword: v.pipe(
      v.string(),
      v.minLength(8, 'Confirm password must be at least 8 characters'),
    ),
  }),

  v.forward(
    v.check(
      (values) => values.password === values.confirmPassword,
      'Passwords do not match',
    ),
    ['confirmPassword'],
  ),
)

export const otpSchema = v.object({
  email: v.pipe(v.string(), v.email('Please enter a valid email address')),

  otp: v.pipe(v.string(), v.length(6, 'OTP must be exactly 6 digits')),
})

export const forgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email('Please enter a valid email address')),
})

export const resetPasswordSchema = v.pipe(
  v.object({
    email: v.pipe(v.string(), v.email('Please enter a valid email address')),

    password: v.pipe(
      v.string(),
      v.minLength(8, 'Password must be at least 8 characters'),
    ),

    confirmPassword: v.pipe(
      v.string(),
      v.minLength(8, 'Confirm password must be at least 8 characters'),
    ),
  }),

  v.forward(
    v.check(
      (values) => values.password === values.confirmPassword,
      'Passwords do not match',
    ),
    ['confirmPassword'],
  ),
)

export const resendOtpSchema = v.object({
  email: v.pipe(v.string(), v.email('Please enter a valid email address')),
})
