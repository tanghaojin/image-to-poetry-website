export function usePublicAsset() {
  const baseURL = useRuntimeConfig().app.baseURL.replace(/\/?$/, '/')

  return (path: string) => `${baseURL}${path.replace(/^\/+/, '')}`
}
