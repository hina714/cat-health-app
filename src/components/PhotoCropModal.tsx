import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImage } from '../utils/cropImage'
import styles from './PhotoCropModal.module.css'

type Props = {
  imageSrc: string
  onComplete: (croppedImage: string) => void
  onCancel: () => void
}

export default function PhotoCropModal({ imageSrc, onComplete, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  const onCropComplete = useCallback((_: unknown, areaPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  const handleDone = async () => {
    if (!croppedAreaPixels) return
    const cropped = await getCroppedImage(imageSrc, croppedAreaPixels)
    onComplete(cropped)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.hint}>ピンチ or スライダーで拡大縮小、ドラッグで位置を調整</p>

        <div className={styles.cropArea}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <input
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          className={styles.slider}
        />

        <div className={styles.buttons}>
          <button className={styles.cancelButton} onClick={onCancel}>キャンセル</button>
          <button className={styles.doneButton} onClick={handleDone}>決定</button>
        </div>
      </div>
    </div>
  )
}
