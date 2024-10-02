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
  // 优先根据 order 字段排序
  if (infoA.order !== undefined && infoB.order !== undefined) {
    return infoA.order - infoB.order;
  } else if (infoA.order !== undefined) {
    return -1; // infoA 有 order 字段，infoB 没有
  } else if (infoB.order !== undefined) {
    return 1; // infoB 有 order 字段，infoA 没有
  }

  // 如果 order 字段相等或不存在，则根据 text 字段排序
  const textA = infoA.text;
  const textB = infoB.text;
  if (textA === undefined || textB === undefined) {
    return 0;
  }

  const infoANfc = textA.normalize('NFC');
  const infoBNfc = textB.normalize('NFC');
  return infoANfc.localeCompare(infoBNfc, 'zh', {
    numeric: true,
  });
}