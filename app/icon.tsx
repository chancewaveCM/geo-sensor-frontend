import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Icon component
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
        }}
      >
        {/* Radar/Sensor icon design */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Center dot */}
          <circle cx="12" cy="12" r="2" fill="white" />

          {/* Inner circle */}
          <circle
            cx="12"
            cy="12"
            r="5"
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.6"
            fill="none"
          />

          {/* Outer circle */}
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="white"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            fill="none"
          />

          {/* Scanning line */}
          <path
            d="M12 12 L20 6"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.8"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
