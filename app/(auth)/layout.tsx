export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-auth-shell className="relative flex min-h-screen items-start justify-center overflow-x-hidden overflow-y-auto bg-background p-4 sm:items-center">
      {/* Subtle decorative background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/5 via-transparent to-brand-orange/5" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v6h6V4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 w-full py-6 sm:py-0">
        <div className="animate-fade-in">
          {children}
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            [data-auth-shell] .auth-card-fallback {
              width: 100%;
              max-width: 28rem;
              margin: 0 auto;
              border: 1px solid #dbe3ed;
              border-radius: 0.75rem;
              background: #ffffff;
              box-shadow: 0 12px 30px rgba(2, 6, 23, 0.08);
            }

            [data-auth-shell] .auth-card-fallback h1 {
              margin: 0;
              font-size: 2rem;
              line-height: 1.1;
            }

            [data-auth-shell] .auth-card-fallback form {
              display: block;
            }

            [data-auth-shell] .auth-card-fallback label {
              display: block;
              margin-bottom: 0.4rem;
              font-size: 0.875rem;
              font-weight: 600;
              color: #1f2937;
            }

            [data-auth-shell] .auth-card-fallback input {
              display: block;
              width: 100%;
              height: 2.5rem;
              border: 1px solid #cbd5e1;
              border-radius: 0.5rem;
              padding: 0.5rem 0.75rem;
              font-size: 0.875rem;
              background: #ffffff;
              color: #111827;
              outline: none;
            }

            [data-auth-shell] .auth-card-fallback input:focus {
              border-color: #e06820;
              box-shadow: 0 0 0 2px rgba(224, 104, 32, 0.16);
            }

            [data-auth-shell] .auth-card-fallback button[type='submit'] {
              width: 100%;
              height: 2.5rem;
              border: 0;
              border-radius: 0.5rem;
              background: #e06820;
              color: #ffffff;
              font-size: 0.875rem;
              font-weight: 700;
              cursor: pointer;
            }

            [data-auth-shell] .auth-card-fallback a.auth-link-fallback {
              color: #e06820;
              font-weight: 600;
              text-decoration: underline;
              text-underline-offset: 2px;
            }
          `,
        }}
      />
    </div>
  )
}
