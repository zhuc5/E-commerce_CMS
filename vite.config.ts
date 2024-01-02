import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// mock插件
import { viteMockServe } from 'vite-plugin-mock'
// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  let env = loadEnv(mode, process.cwd())
  // console.log('env123', env)
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
      viteMockServe({
        enable: command === 'serve',
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    // scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
    // 代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API1]: {
          target: env.VITE_SERVE1,
          changeOrigin: true,
          // 真实的服务器地址不带api，所以替换掉
          rewrite: (path) => path.replace(/^\/api1/, ''),
          bypass(req, res, options: any) {
            const proxyURL = options.target + options.rewrite(req.url)
            // console.log('proxyURL', proxyURL)
          },
        },
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          // 真实的服务器地址不带api，所以替换掉
          rewrite: (path) => path.replace(/^\/api/, ''),
          bypass(req, res, options: any) {
            const proxyURL = options.target + options.rewrite(req.url)
            // console.log('proxyURL1', proxyURL)
          },
        },
      },
    },
  }
})
