/**
 * Compresión de imágenes en el navegador para guardarlas como data URL dentro del
 * documento de Firestore (límite de 1 MB por documento, ver docBytes).
 */

/** Límite de Firestore por documento. */
export const DOC_LIMIT = 1_048_576

/** Tamaño aproximado del documento tal como se guarda (JSON en UTF-8). */
export const docBytes = (data: unknown) => new Blob([JSON.stringify(data)]).size

/** Bytes que ocupa un data URL dentro del documento (el texto base64 completo). */
export const dataUrlBytes = (url: string) => (url.startsWith('data:') ? url.length : 0)

export const formatKB = (bytes: number) => `${Math.max(1, Math.round(bytes / 1024))} KB`

function load(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })
}

/**
 * Reduce la imagen hasta `maxSide` px de lado mayor y baja calidad (y después tamaño)
 * hasta que el data URL (texto base64) quepa en `maxBytes`. Usa WebP si el navegador lo genera
 * (conserva transparencia); si no, JPEG sobre fondo blanco.
 */
export async function compressImage(file: File, { maxSide, maxBytes }: { maxSide: number; maxBytes: number }): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen.')
  const img = await load(file)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Tu navegador no permite procesar la imagen.')

  let side = Math.min(maxSide, Math.max(img.width, img.height))
  let best = ''
  for (let round = 0; round < 6; round++) {
    const k = side / Math.max(img.width, img.height)
    canvas.width = Math.max(1, Math.round(img.width * k))
    canvas.height = Math.max(1, Math.round(img.height * k))
    for (const q of [0.82, 0.72, 0.62, 0.5]) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      let url = canvas.toDataURL('image/webp', q)
      if (!url.startsWith('data:image/webp')) {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        url = canvas.toDataURL('image/jpeg', q)
      }
      best = url
      if (url.length <= maxBytes) return url
    }
    side = Math.round(side * 0.8)
  }
  return best
}
