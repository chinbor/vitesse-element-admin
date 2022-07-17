import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--el-color-primary)',
        1: 'var(--el-color-primary-light-9)',
        2: 'var(--el-color-primary-light-8)',
        3: 'var(--el-color-primary-light-7)',
        5: 'var(--el-color-primary-light-5)',
        7: 'var(--el-color-primary-light-3)',
      },
    },
  },
  shortcuts: [
    ['btn', 'inline-block cursor-pointer text-base select-none transition duration-200 ease-in-out !hover:text-primary text-gray-500  dark:text-gray-200'],
    ['layout', 'flex flex-col flex-nowrap bg-zinc-100 dark:bg-zinc-800 overflow-hidden'],
    ['main', 'm-3 p-3 pb-2 bg-white dark:bg-zinc-900 shadow rounded flex flex-1 flex-col gap-2 overflow-auto'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      // warn: true,
      prefix: '',
      extraProperties: {
        display: 'inline-block',
      },
      collections: {
        custom: FileSystemIconLoader(
          './src/assets/icons',
        ),
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: [
    'ant-design:home-outlined', 'ant-design:setting-outlined', 'ant-design:read-outlined', 'ic:outline-business-center', 'ic:outline-account-tree',
    'text-primary',
    ...'prose prose-sm m-auto text-left'.split(' '),
    ...['blue-500', 'teal-500', 'indigo-500', 'rose-500'].map(i => `group-hover:bg-${i} text-${i}`).join(' ').split(' '),
  ],
})
