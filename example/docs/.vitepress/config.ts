import genConfig from 'test-vitepress-theme-project-trans/config'
import type { SidebarOptions } from 'test-vitepress-theme-project-trans/theme'
import type { ThemeContext } from 'test-vitepress-theme-project-trans/utils'
import { withThemeContext } from 'test-vitepress-theme-project-trans/utils'
import type { DefaultTheme } from 'vitepress'

const nav: DefaultTheme.NavItem[] = []

const sidebarOptions: SidebarOptions = []

const themeConfig: ThemeContext = {
  siteTitle: 'RLE.wiki',
  siteDescription: '一份 RLE 指北',
  /** Repo */
  githubRepoLink: 'https://github.com/project-trans/RLE-wiki',
  /** vitepress 根目录 */
  rootDir: 'docs',
  /** 文档所在目录（目前似未使用此项） */
  include: ['campus', 'contributor-guide', 'fashion'],
  nav,
  sidebarOptions,
}

// https://vitepress.dev/reference/site-config
export default withThemeContext(themeConfig, genConfig)
