export interface FormLogin {
  email: string
  password: string
}

export interface FormForgotPassword {
  email: string
  password: string
  passwordConfirm: string
}

export interface FormRegister {
  email: string
  password: string
  passwordConfirm: string
  name: string
  terms: boolean
}
