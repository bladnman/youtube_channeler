/**
 * Utility functions for copying information to clipboard
 */

interface Video {
  id: string;
  title: string;
  description?: string;
  channelTitle?: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
  duration?: string;
  url: string;
}

export const generateVideoMarkdown = (video: Video): string => {
  const formatNumber = (num?: string) => {
    if (!num) return 'N/A';
    const n = parseInt(num);
    if (isNaN(n)) return num;
    return new Intl.NumberFormat('en-US').format(n);
  };

  return `# ${video.title}

## Video Information
- **Channel:** ${video.channelTitle || 'N/A'}
- **Published:** ${new Date(video.publishedAt).toLocaleDateString()}
- **Duration:** ${video.duration || 'N/A'}
- **Views:** ${formatNumber(video.viewCount)}
- **Likes:** ${formatNumber(video.likeCount)}
- **URL:** ${video.url}

## Description
${video.description || 'No description available.'}

---

`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error);
    return false;
  }
}; 