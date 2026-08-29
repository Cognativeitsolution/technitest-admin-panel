export const SIDEBAR_WIDTH_EXPANDED_PX = 280;
export const SIDEBAR_WIDTH_COLLAPSED_PX = 84;

export function getSidebarWidthPx(collapsed: boolean) {
  return collapsed ? SIDEBAR_WIDTH_COLLAPSED_PX : SIDEBAR_WIDTH_EXPANDED_PX;
}
