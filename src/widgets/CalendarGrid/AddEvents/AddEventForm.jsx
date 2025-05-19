import React, { useState, useEffect } from 'react'
import Button from '../../../shared/ui/Button/Button'
import Input from '../../../shared/ui/Input/Input'
import SelectMenu from '../../../shared/ui/SelectMenu/SelectMenu'
import Textarea from '../../../shared/ui/Textarea/Textarea'
import ColorPicker from '../../../shared/ui/ColorPicker/ColorPicker'
import Calendar from '../../../shared/ui/Calendar/Calendar'
import styles from './AddEventForm.module.css'

const AddEventForm = ({
  initialData = {},
  defaultColors = { work: '#3a86ff', personal: '#ff006e' },
  onSave,
  onCancel,
  onDelete
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: initialData.date ? new Date(initialData.date) : new Date(),
    time: '12:00',
    type: 'work',
    description: '',
    color: defaultColors.work,
    ...initialData
  })

  useEffect(() => {
    if (initialData.date) {
      const date = new Date(initialData.date)
      setFormData(prev => ({
        ...prev,
        date: date,
        time: `${String(date.getHours()).padStart(2, '0')}:${String(
          date.getMinutes()
        ).padStart(2, '0')}`,
        color:
          initialData.color ||
          (initialData.type === 'work'
            ? defaultColors.work
            : defaultColors.personal)
      }))
    }
  }, [initialData, defaultColors])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = e => {
    const type = e.target.value
    setFormData(prev => ({
      ...prev,
      type,
      color: type === 'work' ? defaultColors.work : defaultColors.personal
    }))
  }

  const handleDateSelect = date => {
    setFormData(prev => ({ ...prev, date }))
  }

  const handleSubmit = e => {
    e.preventDefault()
    const eventDate = new Date(formData.date)
    const [hours, minutes] = formData.time.split(':')
    eventDate.setHours(hours, minutes)

    onSave({
      ...formData,
      date: eventDate.toISOString()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <Input
          name='title'
          value={formData.title}
          onChange={handleChange}
          placeholder='Название события'
          required
        />
      </div>

      <div className={styles.dateTimeRow}>
        <div className={styles.calendarContainer}>
          <Calendar
            value={formData.date}
            onDateSelect={handleDateSelect}
            className={styles.calendar}
          />
        </div>

        <div className={styles.timeInput}>
          <Input
            type='time'
            name='time'
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <SelectMenu
          name='type'
          options={[
            { value: 'work', label: 'Рабочее событие' },
            { value: 'personal', label: 'Личное событие' }
          ]}
          initialSelected={formData.type}
          onChange={handleTypeChange}
        />
      </div>

      <div className={styles.formGroup}>
        <ColorPicker
          label='Цвет события'
          defaultColor={formData.color}
          onChange={color => setFormData(prev => ({ ...prev, color }))}
          presetColors={[
            defaultColors.work,
            defaultColors.personal,
            '#3a86ff',
            '#8338ec',
            '#ff006e'
          ]}
        />
      </div>

      <div className={styles.formGroup}>
        <Textarea
          name='description'
          value={formData.description}
          onChange={handleChange}
          placeholder='Описание события'
          rows={4}
        />
      </div>

      <div className={styles.buttons}>
        {initialData.id && (
          <Button
            type='button'
            variant='danger'
            onClick={() => onDelete(initialData.id)}
            className={styles.deleteButton}
          >
            Удалить
          </Button>
        )}
        <Button
          type='button'
          variant='secondary'
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Отмена
        </Button>
        <Button type='submit' variant='primary' className={styles.saveButton}>
          {initialData.id ? 'Сохранить' : 'Создать'}
        </Button>
      </div>
    </form>
  )
}

export default AddEventForm
