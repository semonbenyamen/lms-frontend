export type User = {
  id: number
  name: string
  email: string
  role: 'student' | 'instructor' | 'admin'
  isVerified: boolean
}

type LoginInput = {
  email: string
  password: string
}

type RegisterInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type VerifyOtpInput = {
  email: string
  otp: string
}

type ForgotPasswordInput = {
  email: string
}

type ResetPasswordInput = {
  email: string
  password: string
  confirmPassword: string
}

const users: Array<User & { password: string }> = [
  {
    id: 1,
    name: 'Semon',
    email: 'fake@fake.com',
    password: 'fake12345',
    role: 'student',
    isVerified: true,
  },
]

let currentUser: User | null = null

export const authService = {
  async login(input: LoginInput): Promise<User> {
    const user = users.find(
      (item) => item.email === input.email && item.password === input.password,
    )

    if (!user) {
      throw new Error('Invalid email or password')
    }

    if (!user.isVerified) {
      throw new Error('Account is not verified')
    }

    currentUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    }

    return currentUser
  },

  async register(input: RegisterInput): Promise<User> {
    const exists = users.some((item) => item.email === input.email)

    if (exists) {
      throw new Error('Email is already registered')
    }

    const newUser = {
      id: Date.now(),
      name: input.name,
      email: input.email,
      password: input.password,
      role: 'student' as const,
      isVerified: false,
    }

    users.push(newUser)

    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
    }
  },

  async verifyOtp(input: VerifyOtpInput): Promise<boolean> {
    const user = users.find((item) => item.email === input.email)

    if (!user) {
      throw new Error('User not found')
    }

    if (input.otp !== '123456') {
      throw new Error('Invalid OTP')
    }

    user.isVerified = true

    return true
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<boolean> {
    const user = users.find((item) => item.email === input.email)

    if (!user) {
      throw new Error('User not found')
    }

    return true
  },

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    const user = users.find((item) => item.email === input.email)

    if (!user) {
      throw new Error('User not found')
    }

    user.password = input.password

    return true
  },

  async logout(): Promise<void> {
    currentUser = null
  },

  async getCurrentUser(): Promise<User | null> {
    return currentUser
  },

  async resendOtp(email: string): Promise<boolean> {
    const user = users.find((item) => item.email === email)

    if (!user) {
      throw new Error('User not found')
    }

    return true
  },
}
