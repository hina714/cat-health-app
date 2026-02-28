import styles from './WheelPicker.module.css'

type Props = {
  options: string[]
  value: string
  onChange: (value: string) => void
  unit?: string
}

export default function WheelPicker({ options, value, onChange, unit }: Props) {
  const index = options.indexOf(value)

  const handlePrev = () => {
    if (index > 0) onChange(options[index - 1])
  }

  const handleNext = () => {
    if (index < options.length - 1) onChange(options[index + 1])
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.button}
        onClick={handlePrev}
        disabled={index <= 0}
      >
        ▲
      </button>

      <div className={styles.display}>
        <span className={styles.prev}>{options[index - 1] ?? ''}</span>
        <span className={styles.current}>{value}{unit && ` ${unit}`}</span>
        <span className={styles.next}>{options[index + 1] ?? ''}</span>
      </div>

      <button
        type="button"
        className={styles.button}
        onClick={handleNext}
        disabled={index >= options.length - 1}
      >
        ▼
      </button>
    </div>
  )
}
