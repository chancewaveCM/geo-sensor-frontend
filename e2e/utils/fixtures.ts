/**
 * Valid company profile data for testing
 */
export const testCompanyProfile = {
  name: 'Test Company Inc.',
  industry: 'Technology',
  description: 'A test company for E2E testing purposes. This description is long enough to pass validation.',
  target_audience: 'Developers and QA engineers',
  main_products: 'Testing tools and frameworks',
  competitors: 'Jest, Mocha, Cypress',
  unique_value: 'Comprehensive E2E testing capabilities',
  website_url: 'https://test-company.example.com'
}

/**
 * Minimal valid profile (only required fields)
 */
export const minimalProfile = {
  name: 'Minimal Corp',
  industry: 'Services',
  description: 'Minimal description that meets the 10 character requirement.'
}

/**
 * Invalid profile data for validation testing
 */
export const invalidProfileData = {
  emptyName: { name: '', industry: 'Tech', description: 'Valid description here' },
  shortDescription: { name: 'Test', industry: 'Tech', description: 'Short' },
  missingIndustry: { name: 'Test', industry: '', description: 'Valid description here' },
  invalidUrl: { name: 'Test', industry: 'Tech', description: 'Valid description', website_url: 'not-a-url' }
}

/**
 * Pre-created test user credentials (permanent, not rate-limited)
 * This user is created once and reused across all E2E tests
 */
export const testUserCredentials = {
  name: 'E2E Test',
  email: 'e2etest@example.com',
  password: 'TestPassword123@'
}

/**
 * Invalid user data for validation testing
 */
export const invalidUserData = {
  weakPassword: { name: 'Test', email: 'test@test.com', password: '123' },
  invalidEmail: { name: 'Test', email: 'not-an-email', password: 'ValidPass123!' },
  missingName: { name: '', email: 'test@test.com', password: 'ValidPass123!' }
}

/**
 * Korean text patterns for UI validation
 */
export const koreanLabels = {
  login: {
    heading: /로그인/,
    email: /이메일/,
    password: /비밀번호/,
    submit: /로그인/,
    registerLink: /회원가입/
  },
  register: {
    heading: /회원가입/,
    name: /이름/,
    email: /이메일/,
    password: /비밀번호/,
    confirmPassword: /비밀번호 확인/,
    submit: /회원가입/
  },
  settings: {
    heading: /설정/,
    profileTab: /기업 프로필/,
    addProfile: /새 프로필 추가/,
    editProfile: /수정/,
    deleteProfile: /비활성화/
  },
  dashboard: {
    heading: /대시보드/
  }
}
