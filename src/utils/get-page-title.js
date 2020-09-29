import defaultSettings from '@/settings'

const title = defaultSettings.title || '河北分公司销售管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
