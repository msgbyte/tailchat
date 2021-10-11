// tailwind.config.js
// Reference: https://www.tailwindcss.cn/docs/configuration
// 默认配置文件: https://unpkg.com/browse/tailwindcss@2.2.7/stubs/defaultConfig.stub.js

const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

const customTheme = {
  boxShadow: {
    normal: 'rgba(0, 0, 0, 0.15) 0 0 8px',
    elevationStroke: '0 0 0 1px rgba(4,4,5,0.15)',
    elevationLow:
      '0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05)',
    elevationMedium: '0 4px 4px rgba(0,0,0,0.16)',
    elevationHigh: '0 8px 16px rgba(0,0,0,0.24)',
  },
};

const tailchat = plugin(({ addUtilities }) => {
  // Reference: https://www.tailwindcss.cn/docs/plugins#adding-utilities
  const newUtilities = {
    '.thin-line-bottom': {
      '&::after': {
        content: '" "',
        position: 'absolute',
        display: 'block',
        bottom: '1px',
        left: 0,
        right: 0,
        height: '1px',
        boxShadow: customTheme.boxShadow.elevationLow,
        zIndex: 1,
        pointerEvents: 'none',
      },
    },
  };

  addUtilities(newUtilities);
});

module.exports = {
  purge: {
    enabled: process.env.NODE_ENV !== 'development',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
  },
  darkMode: 'class', // or 'media'
  important: '#app',
  theme: {
    screens: {
      lg: { min: '1024px' },
      md: { max: '767px' },
      sm: { max: '639px' },
      mobile: { max: '639px' }, // alias
      desktop: { min: '640px' }, // alias
    },
    extend: {
      colors: {
        navbar: {
          light: colors.coolGray[300],
          dark: colors.coolGray[900],
        },
        sidebar: {
          light: colors.coolGray[200],
          dark: colors.coolGray[800],
        },
        content: {
          light: colors.coolGray[100],
          dark: colors.coolGray[700],
        },
        typography: {
          light: colors.coolGray[700],
          dark: 'rgba(255, 255, 255, 0.85)',
        },
      },
      borderRadius: {
        '1/2': '50%',
      },
      spacing: {
        18: '4.5rem',
        142: '35.5rem',
        160: '40rem',
      },
      lineHeight: {
        13: '3.25rem',
      },
      boxShadow: {
        ...customTheme.boxShadow,
      },
      transitionProperty: {
        width: 'width',
      },
      zIndex: {
        '-1': '-1',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      display: ['group-hover'],
      borderRadius: ['hover'],
      borderWidth: ['last'],
      height: ['group-hover'],
    },
  },
  plugins: [tailchat],
};
