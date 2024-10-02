import type {
  SidebarItem,
  SidebarMultiItem,
  VitePressSidebarOptions,
} from 'vitepress-sidebar';
import { generateSidebar as genSidebar } from 'vitepress-sidebar';
import { useThemeContext } from './utils/themeContext';

export function generateSidebar() {
  const { sidebarOptions } = useThemeContext();
  const optionMap: Map<string, VitePressSidebarOptions> = new Map(
    sidebarOptions.map(obj => [obj.resolvePath.toString(), obj])
  );
  const sidebar = genSidebar(sidebarOptions);

  for (const key in sidebar) {
    const sidebarMultiItem: SidebarMultiItem = (sidebar as any)[key];
    if (optionMap.get(sidebarMultiItem.base)?.sortMenusByFrontmatterOrder !== true) {
      sidebarMultiItem.items.sort(sidebarTitleSorter);
    }
  }
  return sidebar;
}

// 优先使用 order 排序，没有 order 时使用 text 排序
function sidebarTitleSorter(infoA: SidebarItem, infoB: SidebarItem): number {
  const orderA = infoA.order;
  const orderB = infoB.order;

  // 优先根据 order 字段排序
  if (orderA !== undefined && orderB !== undefined) {
    return orderA - orderB; // 如果两个都有 order，按 order 排序
  } else if (orderA !== undefined) {
    return -1; // infoA 有 order，infoB 没有，infoA 优先
  } else if (orderB !== undefined) {
    return 1; // infoB 有 order，infoA 没有，infoB 优先
  }

  // 如果没有 order 字段或 order 相等，则根据 text 排序
  const textA = infoA.text || ""; // 处理 text 为空的情况
  const textB = infoB.text || "";

  const infoANfc = textA.normalize('NFC');
  const infoBNfc = textB.normalize('NFC');

  return infoANfc.localeCompare(infoBNfc, 'zh', { numeric: true });
}
