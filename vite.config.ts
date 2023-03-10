import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import postcssPresetEnv from 'postcss-preset-env'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
    postcss: {
      plugins: [postcssPresetEnv],
    },
  },
  ssr: {
    format: 'cjs',
  },
})
