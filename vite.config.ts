import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({}) => {
  return {
    plugins: [
      vue(),

      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ElementComponent',
        fileName: 'index',
        formats: ['es']
      },
      rollupOptions: {
        external: ['vue', 'element-plus', '@element-plus/icons-vue'],
        output: {
          globals: {
            vue: 'Vue',
            'element-plus': 'ElementPlus',
            '@element-plus/icons-vue': 'ElementPlusIconsVue'
          }
        }
      },
      minify: 'oxc'
    }
  }
})
