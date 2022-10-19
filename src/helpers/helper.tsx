import { PAYMENT_METHOD, PAYMENT_METHOD_SHOW } from '@src/interfaces/enums'

const helper = {
  testClipboard: (key) => {
    navigator.clipboard.writeText(key).then(
      (v) => console.log('Success' + v),
      (e) => console.log('Fail\n' + e)
    )
    const input = document.body.appendChild(document.createElement('input'))
    input.value = key
    input.focus()
    input.select()
    document.execCommand('copy')
    input.parentNode.removeChild(input)
    // window?.['android']?.NativeAndroid?.copyToClipboard(key)
  },
  showPaymentMethod: (method: PAYMENT_METHOD) => {
    switch (method) {
      case PAYMENT_METHOD.COD:
        return PAYMENT_METHOD_SHOW.COD
        break
      case PAYMENT_METHOD.ONLINE:
        return PAYMENT_METHOD_SHOW.ONLINE
        break
      default:
        return null
    }
  },
}
export default helper
