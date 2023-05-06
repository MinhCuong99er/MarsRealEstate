import React, { FC, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { RULE_EMAIL } from '@src/contains/contants'
import { FormForgotPassword } from '@src/interfaces/Auth'

interface ForgotPasswordProps {}

const ForgotPassword: FC<ForgotPasswordProps> = (props: ForgotPasswordProps) => {
  const {} = props
  const [form, setForm] = useState<Partial<FormForgotPassword>>({})
  const [errors, setErrors] = useState<Partial<FormForgotPassword>>({})

  const setField = (field, value) => {
    setForm({ ...form, [field]: value })
    // @ts-ignore
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const validateForm = () => {
    const { email, password, passwordConfirm } = form
    const newErrors: Partial<FormForgotPassword> = {}
    if (!email) {
      newErrors.email = 'Please fill email'
    } else if (email && !RULE_EMAIL.pattern.test(email)) {
      newErrors.email = 'Please validate email'
    }
    if (!password) {
      newErrors.password = 'Please fill password'
    }
    if (!passwordConfirm) {
      newErrors.passwordConfirm = 'Please fill password confirm'
    } else if (password && passwordConfirm && password != passwordConfirm) {
      newErrors.passwordConfirm = 'Password confirm no match'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
    } else {
      console.log('🚀 ~ file: Login.tsx:24 ~ handleSubmit ~ form:', form)
    }
  }

  return (
    <>
      <div className="c-form">
        <div className="c-form__title">
          <h2>Lấy lại mật khẩu</h2>
        </div>
        <div className="c-form__body">
          <Form>
            <Form.Group className="mb-4" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) => setField('email', e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="password">
              <Form.Control
                type="password"
                placeholder="Mật khẩu"
                onChange={(e) => setField('password', e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="passwordConfirm">
              <Form.Control
                type="password"
                placeholder="Nhập lại Mật khẩu"
                onChange={(e) => setField('passwordConfirm', e.target.value)}
                isInvalid={!!errors.passwordConfirm}
              />
              <Form.Control.Feedback type="invalid">{errors.passwordConfirm}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="submit">
              <Button variant="danger" type="submit" className="w-100" onClick={handleSubmit}>
                Xác nhận
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
