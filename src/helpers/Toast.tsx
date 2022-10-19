import React from 'react'
import { ToastContainer as ToastContainerDefault, toast, ToastContent } from 'react-toastify'

export const ToastContainer = () => {
  // const []
  return (
    <ToastContainerDefault
      position="top-right"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  )
}

class ToastUtil {
  public info(message: ToastContent, opts = {}) {
    toast.dismiss()
    toast.info(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...opts,
    })
  }

  public success(message: ToastContent, opts = {}) {
    toast.dismiss()
    toast.success(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...opts,
    })
  }

  public warning(message: ToastContent, opts = {}) {
    toast.dismiss()
    toast.warn(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...opts,
    })
  }

  public error(message: ToastContent, opts = {}) {
    toast.dismiss()
    toast.error(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...opts,
    })
  }
}

export const toastUtil = new ToastUtil()
