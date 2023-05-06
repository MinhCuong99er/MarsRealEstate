import React, { FC, useState } from 'react'
import Link from 'next/link'
import { Button, Form } from 'react-bootstrap'
import { RULE_EMAIL } from '@src/contains/contants'
import { FormLogin } from '@src/interfaces/Auth'

interface LoginProps {}

const Login: FC<LoginProps> = (props: LoginProps) => {
  const {} = props
  const [form, setForm] = useState<Partial<FormLogin>>({})
  const [errors, setErrors] = useState<Partial<FormLogin>>({})

  const setField = (field, value) => {
    setForm({ ...form, [field]: value })
    // @ts-ignore
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const validateForm = () => {
    const { email, password } = form
    const newErrors: Partial<FormLogin> = {}
    if (!email) {
      newErrors.email = 'Please fill email'
    } else if (email && !RULE_EMAIL.pattern.test(email)) {
      newErrors.email = 'Please validate email'
    }
    if (!password) {
      newErrors.password = 'Please fill password'
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
          <h2>Đăng Nhập</h2>
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
            <Form.Group controlId="submit">
              <Button variant="danger" type="submit" className="w-100" onClick={handleSubmit}>
                Đăng nhập
              </Button>
            </Form.Group>
          </Form>
        </div>
        <div className="c-form__bottom">
          <div>
            <Link href="/auth/forgot-password" className="text-primary">
              Quên mật khẩu?
            </Link>
          </div>
          <div>
            Bạn chưa có tài khoản?{' '}
            <Link href="/auth/register" className="text-primary">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
