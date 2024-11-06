export function getLastPathWithoutQuery(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
      if (pathSegments.length === 0) return null;
      return pathSegments[pathSegments.length - 1];
    } catch (error) {
      console.error('Invalid URL:', error);
      return null;
    }
  }