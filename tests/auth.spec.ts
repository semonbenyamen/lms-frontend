import { test, expect } from '@playwright/test'

const testUser = {
  name: 'E2E User',
  email: 'e2e@test.com',
  password: 'password123',
  newPassword: 'newpassword123',
}

test.describe.serial('authentication flow', () => {
  test('unauthenticated user is redirected from courses to login', async ({
    page,
  }) => {
    await page.goto('/courses')

    await expect(page).toHaveURL(/\/login/)
  })

  test('invalid login shows an error', async ({ page }) => {
    await page.goto('/login')

    const loginButton = page.getByRole('button', {
      name: 'Login',
    })

    await expect(loginButton).toBeEnabled()

    await page.getByLabel('Email').fill('wrong@test.com')
    await page.getByLabel('Password').fill('wrong12345')

    await loginButton.click()

    await expect(page).toHaveURL(/\/login/)

    await expect(
      page.getByRole('alert'),
    ).toHaveText('Invalid email or password')
  })

  test('register validation catches different passwords', async ({
    page,
  }) => {
    await page.goto('/register')
    await page.waitForTimeout(500)

    await page.getByLabel('Name').fill('Test User')
    await page.getByLabel('Email').fill('validation@test.com')

    await page
      .getByLabel('Password', { exact: true })
      .fill('password123')

    await page
      .getByLabel('Confirm Password')
      .fill('password456')

    await expect(
      page.getByText('Passwords do not match'),
    ).toBeVisible()
  })

  test('user can register', async ({ page }) => {
    await page.goto('/register')
    await page.waitForTimeout(500)

    await page.getByLabel('Name').fill(testUser.name)
    await page.getByLabel('Email').fill(testUser.email)

    await page
      .getByLabel('Password', { exact: true })
      .fill(testUser.password)

    await page
      .getByLabel('Confirm Password')
      .fill(testUser.password)

    await page
      .getByRole('button', { name: 'Create Account' })
      .click()

    await expect(page).toHaveURL(/\/verify-otp/)

    await expect(page).toHaveURL(
      new RegExp(
        `email=${encodeURIComponent(testUser.email)}`,
      ),
    )
  })

  test('invalid OTP is rejected', async ({ page }) => {
    await page.goto(
      `/verify-otp?email=${encodeURIComponent(testUser.email)}`,
    )

    const verifyButton = page.getByRole('button', {
      name: 'Verify Account',
    })

    await expect(verifyButton).toBeEnabled()

    await page.getByLabel('OTP').fill('111111')

    await verifyButton.click()

    await expect(
      page.getByRole('alert'),
    ).toHaveText('Invalid OTP')
  })

  test('OTP can be resent', async ({ page }) => {
    await page.goto(
      `/verify-otp?email=${encodeURIComponent(testUser.email)}`,
    )

    const resendButton = page.getByRole('button', {
      name: 'Resend OTP',
    })

    await expect(resendButton).toBeEnabled()

    await resendButton.click()

    await expect(
      page.getByText('OTP sent successfully.'),
    ).toBeVisible()
  })

  test('user can verify account with OTP', async ({ page }) => {
    await page.goto(
      `/verify-otp?email=${encodeURIComponent(testUser.email)}`,
    )

    const verifyButton = page.getByRole('button', {
      name: 'Verify Account',
    })

    await expect(verifyButton).toBeEnabled()

    await page.getByLabel('OTP').fill('123456')

    await verifyButton.click()

    await expect(page).toHaveURL(/\/login/)
  })

  test('verified user can login', async ({ page }) => {
    await page.goto('/login')

    const loginButton = page.getByRole('button', {
      name: 'Login',
    })

    await expect(loginButton).toBeEnabled()

    await page.getByLabel('Email').fill(testUser.email)

    await page
      .getByLabel('Password')
      .fill(testUser.password)

    await loginButton.click()

    await expect(page).toHaveURL(/\/courses/)
  })

  test('user can logout', async ({ page }) => {
    await page.goto('/courses')

    await page
      .getByRole('button', { name: 'Logout' })
      .click()

    await expect(page).toHaveURL(/\/login/)
  })

  test('protected route is blocked after logout', async ({
    page,
  }) => {
    await page.goto('/courses')

    await expect(page).toHaveURL(/\/login/)
  })

  test('user can start forgot password flow', async ({
    page,
  }) => {
    await page.goto('/forgot-password')
    await page.waitForTimeout(500)

    await page.getByLabel('Email').fill(testUser.email)

    await page
      .getByRole('button', { name: 'Continue' })
      .click()

    await expect(page).toHaveURL(/\/reset-password/)

    await expect(page).toHaveURL(
      new RegExp(
        `email=${encodeURIComponent(testUser.email)}`,
      ),
    )
  })

  test('reset password validation catches mismatch', async ({
    page,
  }) => {
    await page.goto(
      `/reset-password?email=${encodeURIComponent(testUser.email)}`,
    )

    await page.waitForTimeout(500)

    await page
      .getByLabel('New Password')
      .fill('different123')

    await page
      .getByLabel('Confirm Password')
      .fill('different456')

    await expect(
      page.getByText('Passwords do not match'),
    ).toBeVisible()
  })

  test('user can reset password', async ({ page }) => {
    await page.goto(
      `/reset-password?email=${encodeURIComponent(testUser.email)}`,
    )

    await page.waitForTimeout(500)

    await page
      .getByLabel('New Password')
      .fill(testUser.newPassword)

    await page
      .getByLabel('Confirm Password')
      .fill(testUser.newPassword)

    await page
      .getByRole('button', { name: 'Reset Password' })
      .click()

    await expect(page).toHaveURL(/\/login/)
  })

  test('user can login with new password', async ({ page }) => {
    await page.goto('/login')

    const loginButton = page.getByRole('button', {
      name: 'Login',
    })

    await expect(loginButton).toBeEnabled()

    await page.getByLabel('Email').fill(testUser.email)

    await page
      .getByLabel('Password')
      .fill(testUser.newPassword)

    await loginButton.click()

    await expect(page).toHaveURL(/\/courses/)
  })

  test('authenticated user cannot open login page', async ({
    page,
  }) => {
    await page.goto('/login')

    await expect(page).toHaveURL(/\/courses/)
  })

  test('final logout works', async ({ page }) => {
    await page.goto('/courses')

    await page
      .getByRole('button', { name: 'Logout' })
      .click()

    await expect(page).toHaveURL(/\/login/)
  })
})