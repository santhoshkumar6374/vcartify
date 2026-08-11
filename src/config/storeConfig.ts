export function getStoreCode(): string {
  const pathname = window.location.pathname;
  const pathSegment = pathname.split('/').filter(Boolean)[0];

  if (pathSegment) return pathSegment;

  const queryStore = new URLSearchParams(window.location.search).get('store');
  if (queryStore) return queryStore;

  
  return ''; // no store — same as bare production domain
}