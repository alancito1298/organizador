// tailwind.config.mjs
export default {
    content: [
      "./src/app/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          brand: {
            light: 'blue-100',
            primary: 'red-500',
            secondary: '#8BC6A3',
            accent: '#F2716B',
            text: '#2E3A59',
            neutral: '#E5E7EB',
            dark: '#6B7280',
          },
        },
      },
    },
    plugins: [],
  }
  