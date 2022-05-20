import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import { useAppDispatch } from '@/state/hooks'
import { createConfig } from '../../state/admin/config/configState'

const AddConfig = ({ closeModal }) => {
  const dispatch = useAppDispatch()
  // const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    key: '',
    value: '',
  })

  const {
    handleSubmit,
    // formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async () => {
    dispatch(createConfig(formData))
    closeModal()
  })

  const options = [
    {
      className: `${css['loginButton']} primary`,
      label: 'save',
      onClick: onSubmit,
    },
  ]

  return (
    <Modal title="Add Configuration" options={options} icon="info">
      <div className={css['login-container']}>
        {/* {error && <span className={css['error-message']}>{error}</span>} */}
        <form>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Key
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.key}
              onChange={e => setFormData({ ...formData, key: e.target.value })}
            />
          </div>
          <div className={css['input-container']}>
            <label className={css['label']} htmlFor="">
              Value
            </label>
            <input
              type="text"
              className={css['input']}
              value={formData.value}
              onChange={e =>
                setFormData({ ...formData, value: e.target.value })
              }
            />
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default AddConfig