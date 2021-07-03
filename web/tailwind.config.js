// tailwind.config.js
// Reference: https://www.tailwindcss.cn/docs/configuration

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV !== 'development',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
  },
  darkMode: 'class', // or 'media'
  theme: {
    screens: {
      lg: { min: '1024px' },
      md: { max: '767px' },
      sm: { max: '639px' },
    },
    extend: {
      borderRadius: {
        '1/2': '50%',
      },
      spacing: {
        18: '4.5rem',
        142: '35.5rem',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      display: ['group-hover'],
      borderRadius: ['hover'],
    },
  },
  plugins: [],
};
