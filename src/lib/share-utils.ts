export interface ShareData {
  title: string
  text: string
  url: string
}

export async function sharePost(data: ShareData): Promise<boolean> {
  // Check if Web Share API is supported
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(data)
      return true
    } catch (error) {
      // User cancelled the share or an error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error)
        // Fall back to clipboard if share fails
        return await fallbackShare(data)
      }
      return false
    }
  } else {
    // Fallback for browsers that don't support Web Share API
    return await fallbackShare(data)
  }
}

async function fallbackShare(data: ShareData): Promise<boolean> {
  try {
    // Try to copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const shareText = `${data.title}\n\n${data.text}\n\n${data.url}`
      await navigator.clipboard.writeText(shareText)

      return true
    } else if (typeof window !== 'undefined') {
      // Last resort: open in new tab for manual sharing
      window.open(data.url, '_blank')
      return true
    }
    return false
  } catch (error) {
    console.error('Fallback share failed:', error)
    return false
  }
}

export function generatePostShareData(post: {
  id: string
  type: string
  animalSpecies: string
  animalBreed?: string
  petDescription: string
  user?: { fullName: string } | null
  pet?: { name: string } | null
}): ShareData {
  const postType = post.type === 'lost' ? 'Perdido' : 'Encontrado'
  const animalName = post.pet?.name || post.animalSpecies
  const userName = post.user?.fullName || 'Usuário'

  const title = `${postType}: ${animalName}`
  const text = `${userName} ${post.type === 'lost' ? 'perdeu' : 'encontrou'} um ${post.animalSpecies}${post.animalBreed ? ` ${post.animalBreed}` : ''}.

${post.petDescription}

Ajude a divulgar para reunir este pet com sua família! 🐾`

  // Use current domain or fallback to a generic URL
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://petbook.app'

  const url = `${baseUrl}/post/${post.id}`

  return { title, text, url }
}
