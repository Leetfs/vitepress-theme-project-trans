import type {
  SidebarItem,
  SidebarMultiItem,
  VitePressSidebarOptions,
} from 'vitepress-sidebar'
import { generateSidebar as genSidebar } from 'vitepress-sidebar'
import { useThemeContext } from './utils/themeContext'

export function generateSidebar() {
  const { sidebarOptions } = useThemeContext()
  const optionMap: Map<string, VitePressSidebarOptions> = new Map(sidebarOptions.map(obj => [obj.resolvePath.toString(), obj]));
  const sidebar = genSidebar(sidebarOptions)
  for (const key in sidebar) {
    const sidebarMultiItem: SidebarMultiItem = (sidebar as any)[key]
    if (optionMap.get(sidebarMultiItem.base)?.sortMenusByFrontmatterOrder !== true) {
      sidebarMultiItem.items.sort(sidebarTitleSorter)
    }
  }
  return sidebar
}

function sidebarTitleSorter(infoA: SidebarItem, infoB: SidebarItem): number {
  // 如果两个项都有 order
  if (infoA.order !== undefined && infoB.order !== undefined) {
    // order 不同，按 order 排序
    if (infoA.order !== infoB.order) {
      return infoA.order - infoB.order;
    }
    // order 相同，按 text 排序
    else {
      const textA = infoA.text || ""; // 如果 text 为 undefined，默认为空字符串
      const textB = infoB.text || ""; // 如果 text 为 undefined，默认为空字符串
      return textA.localeCompare(textB, 'zh', { numeric: true });
    }
  }
  
  // 只有 infoA 有 order，infoB 没有
  if (infoA.order !== undefined) {
    return -1; // infoA 应在前面
  }
  
  // 只有 infoB 有 order，infoA 没有
  if (infoB.order !== undefined) {
    return 1; // infoB 应在前面
  }

  // 如果两个项都没有 order，按 text 排序
  const textA = infoA.text || ""; // 默认空字符串处理
  const textB = infoB.text || ""; // 默认空字符串处理
  return textA.localeCompare(textB, 'zh', { numeric: true });
}
