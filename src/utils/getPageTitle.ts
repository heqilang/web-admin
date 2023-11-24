const title = import.meta.env.VITE_APP_SYSTEM_NAME;

export default function getPageTitle(pageTitle?: string | unknown) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
