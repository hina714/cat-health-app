type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

export const getCroppedImage = (imageSrc: string, cropArea: CropArea): Promise<string> => {
  return new Promise((resolve) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = cropArea.width
      canvas.height = cropArea.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height,
      )
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
  })
}
