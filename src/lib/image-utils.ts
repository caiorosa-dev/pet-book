// Funções utilitárias para processar imagens no lado cliente

export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Apenas imagens JPEG, PNG e WebP são permitidas.',
    }
  }

  const maxSizeInBytes = 10 * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: 'A imagem deve ter no máximo 10MB.',
    }
  }

  return { valid: true }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function processImageFiles(files: File[]): Promise<
  {
    id: string
    file: string // base64
    filename: string
    mimeType: string
    preview: string
  }[]
> {
  const processedFiles = []

  for (const file of files) {
    const validation = validateImageFile(file)

    if (!validation.valid) {
      throw new Error(validation.error)
    }

    try {
      const base64 = await fileToBase64(file)
      processedFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file: base64,
        filename: file.name,
        mimeType: file.type,
        preview: base64,
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Erro ao processar imagem: ' + error.message)
      }
      throw new Error('Erro ao processar imagem')
    }
  }

  return processedFiles
}
