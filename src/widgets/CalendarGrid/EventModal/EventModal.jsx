import React, { useCallback } from 'react'
import Modal from '../../../shared/ui/Modal/Modal'
import AddEventForm from '../AddEvents/AddEventForm'

const EventModal = React.memo(
  ({ isOpen, onClose, onSave, initialData, onDelete, defaultColors }) => {
    const handleSave = useCallback(
      data => {
        onSave(data)
      },
      [onSave]
    )

    const handleDelete = useCallback(() => {
      onDelete()
    }, [onDelete])

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        width='520px'
        padding='0'
        borderRadius='12px'
      >
        <AddEventForm
          initialData={initialData}
          onSave={handleSave}
          onCancel={onClose}
          onDelete={handleDelete}
          defaultColors={defaultColors}
        />
      </Modal>
    )
  }
)

export default EventModal
