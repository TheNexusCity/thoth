import VideoInput from '@/screens/HomeScreen/components/VideoInput'
import Window from '../../../components/Window/Window'

import '../../../screens/Thoth/thoth.module.css'
import axios from 'axios'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

const VideoTranscription = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [file, setFile] = useState('')
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm()
  const loadFile = selectedFile => {
    // uploadFile(selectedFile)
    setFile(selectedFile)
  }

  const uploadFile = async (file, data) => {
    let formData = new FormData()
    formData.append('video', file)

    let reqData = {
      ...data ,
      metaDesc: "demo",
      keywords: "demo"
    }

    formData.append('data', JSON.stringify(reqData))
    let url = `${process.env.REACT_APP_API_URL}/video`

    // console.log(Postdata)

    try {
      await axios.post(url, formData)
      enqueueSnackbar('Video uploaded', { variant: 'success' })
    } catch (err) {
      console.log(err)
      enqueueSnackbar('Video not uploaded', { variant: 'error' })
    }
  }

  const onCreate = handleSubmit(async data => {
    console.log('DATa =>', data)
    uploadFile(file, data)
  })

  return (
      <Window>
        <p>Upload Video</p>
        <form>
          <label htmlFor="">Title</label>
          <input
              type="text"
              // className={css['input']}
              defaultValue=""
              {...register('title')}
          />

          <label htmlFor="">Description</label>
          <input
              type="text"
              // className={css['input']}
              defaultValue=""
              {...register('description')}
          />
          {/* {error && <span className={css['error-message']}>{error}</span>} */}
        </form>
        <VideoInput loadFile={loadFile} />
        <button
            // className={!selectedTemplate ? 'disabled' : 'primary'}
            onClick={onCreate}
        >
          Upload
        </button>
      </Window>
  )
}

export default VideoTranscription
