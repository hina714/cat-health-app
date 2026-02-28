import { useState } from 'react'
import styles from './ProfilePage.module.css'

type ProfileForm = {
  name: string
  birthdate: string
  breed: string
  sex: 'male' | 'female' | ''
  neutered: 'true' | 'false' | ''
}

const initialForm: ProfileForm = {
  name: '',
  birthdate: '',
  breed: '',
  sex: '',
  neutered: '',
}

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileForm>(() => {
    const saved = localStorage.getItem('cat_profile')
    return saved ? JSON.parse(saved) : initialForm
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    localStorage.setItem('cat_profile', JSON.stringify(form))
    setSaved(true)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>プロフィール</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">名前</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="例: みけ"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="birthdate">生年月日</label>
          <input
            id="birthdate"
            name="birthdate"
            type="date"
            value={form.birthdate}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="breed">品種</label>
          <input
            id="breed"
            name="breed"
            type="text"
            value={form.breed}
            onChange={handleChange}
            placeholder="例: スコティッシュフォールド"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>性別</span>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="sex"
                value="male"
                checked={form.sex === 'male'}
                onChange={handleChange}
              />
              オス
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="sex"
                value="female"
                checked={form.sex === 'female'}
                onChange={handleChange}
              />
              メス
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>避妊・去勢</span>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="neutered"
                value="true"
                checked={form.neutered === 'true'}
                onChange={handleChange}
              />
              済
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="neutered"
                value="false"
                checked={form.neutered === 'false'}
                onChange={handleChange}
              />
              未
            </label>
          </div>
        </div>

        <button type="submit" className={styles.button}>保存する</button>

        {saved && <p className={styles.savedMessage}>保存しました</p>}
      </form>
    </div>
  )
}
