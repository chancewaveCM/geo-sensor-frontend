import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Brand colors from Stitch design system
        brand: {
          orange: 'hsl(var(--brand-orange))',
          'orange-hover': 'hsl(var(--brand-orange-hover))',
          navy: 'hsl(var(--brand-navy))',
          'navy-light': 'hsl(var(--brand-navy-light))',
        },
        // Semantic colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        // Background & surface colors
        background: {
          DEFAULT: 'hsl(var(--background))',
          subtle: 'hsl(var(--background-subtle))',
        },
        foreground: 'hsl(var(--foreground))',
        // UI element colors (shadcn compatible)
        border: {
          DEFAULT: 'hsl(var(--border))',
          strong: 'hsl(var(--border-strong))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          hover: 'hsl(var(--card-hover))',
        },
        // Neutral gray scale from design system
        gray: {
          50: 'hsl(var(--gray-50))',
          100: 'hsl(var(--gray-100))',
          200: 'hsl(var(--gray-200))',
          300: 'hsl(var(--gray-300))',
          400: 'hsl(var(--gray-400))',
          500: 'hsl(var(--gray-500))',
          600: 'hsl(var(--gray-600))',
          700: 'hsl(var(--gray-700))',
          800: 'hsl(var(--gray-800))',
          900: 'hsl(var(--gray-900))',
        },
        // Chart colors for data visualization
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
          6: 'hsl(var(--chart-6))',
          7: 'hsl(var(--chart-7))',
          8: 'hsl(var(--chart-8))',
          grid: 'hsl(var(--chart-grid))',
          axis: 'hsl(var(--chart-axis-text))',
        },
        // Category badge colors
        category: {
          introductory: {
            DEFAULT: 'hsl(var(--category-introductory-bg))',
            text: 'hsl(var(--category-introductory-text))',
          },
          comparative: {
            DEFAULT: 'hsl(var(--category-comparative-bg))',
            text: 'hsl(var(--category-comparative-text))',
          },
          critical: {
            DEFAULT: 'hsl(var(--category-critical-bg))',
            text: 'hsl(var(--category-critical-text))',
          },
        },
        // Rank / medal colors
        rank: {
          'gold-from': 'hsl(var(--rank-gold-from))',
          'gold-to': 'hsl(var(--rank-gold-to))',
          'silver-from': 'hsl(var(--rank-silver-from))',
          'silver-to': 'hsl(var(--rank-silver-to))',
          'bronze-from': 'hsl(var(--rank-bronze-from))',
          'bronze-to': 'hsl(var(--rank-bronze-to))',
        },
        // Grade colors
        grade: {
          a: 'hsl(var(--grade-a))',
          b: 'hsl(var(--grade-b))',
          c: 'hsl(var(--grade-c))',
          d: 'hsl(var(--grade-d))',
          f: 'hsl(var(--grade-f))',
        },
        // Sentiment colors
        sentiment: {
          positive: 'hsl(var(--sentiment-positive))',
          neutral: 'hsl(var(--sentiment-neutral))',
          negative: 'hsl(var(--sentiment-negative))',
        },
        // Trend colors
        trend: {
          up: 'hsl(var(--trend-up))',
          down: 'hsl(var(--trend-down))',
        },
        // Step / wizard colors
        step: {
          completed: {
            DEFAULT: 'hsl(var(--step-completed-bg))',
            text: 'hsl(var(--step-completed-text))',
            hover: 'hsl(var(--step-completed-hover))',
            icon: 'hsl(var(--step-completed-icon))',
            line: 'hsl(var(--step-completed-line))',
          },
        },
        // Status colors
        status: {
          active: 'hsl(var(--status-active))',
          inactive: 'hsl(var(--status-inactive))',
          pending: 'hsl(var(--status-pending))',
          error: 'hsl(var(--status-error))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        'h6': ['0.875rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
        'overline': ['0.6875rem', { lineHeight: '1.4', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
        'sidebar': '256px',
        'header': '64px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease forwards',
        'slide-in-right': 'slide-in-right 0.3s ease forwards',
        'shimmer': 'shimmer 2s infinite linear',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
