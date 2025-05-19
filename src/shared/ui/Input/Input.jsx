import React from 'react'
import styles from './Input.module.css'

export default function Input ({
  type = 'text',
  value = '',
  onChange,
  disabled = false,
  error = '',
  icon = null,
  ...props
}) {
  const getStateClass = () => {
    if (disabled) return styles.disabled
    if (error) return styles.error
    if (props.readOnly) return styles.filled
    return styles.default
  }

  const [isActive, setIsActive] = React.useState(false)

  const inputClass = `${styles.input} ${getStateClass()} ${
    isActive ? styles.active : ''
  } ${icon ? styles.withIcon : ''}`

  return (
    <div className={styles.inputWrapper}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={inputClass}
        disabled={disabled}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  )
}
