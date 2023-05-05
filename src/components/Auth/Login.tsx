import React, { FC, useState } from 'react'
import Link from 'next/link'
import { Button, Form } from 'react-bootstrap'

interface LoginProps {}

const Login: FC<LoginProps> = (props: LoginProps) => {
  const {} = props
  const msgErr = ''
  const [form, setForm] = useState<any>({})
  const [errors, setErrors] = useState<any>({})

  const setField = (field, value) => {
    setForm({ ...form, [field]: value })
    // @ts-ignore
    if (!errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const validateForm = () => {
    const { email, password } = form
    const newErrors: any = {}
    if (!email) {
      newErrors.email = 'Please fill email'
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
      <div className="login rounded">
        <div className="login-header">
          <h2 className="text-center w-100 alert-link">Đăng Nhập</h2>
        </div>
        <p className="mb-0 ml-4 text-center" style={{ color: 'red' }}>
          {msgErr}
        </p>
        <div className="login-body my-3">
          <form>
            <div className="form-group my-4">
              <input type="email" className="form-control" placeholder="Email" />
            </div>
            <div className="form-group my-2">
              <input type="password" className="form-control" placeholder="Mật khẩu" />
            </div>
            <div className="form-group my-4">
              <button type="submit" className="btn btn-danger btn-block btn-lg w-100">
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
        <div className="login-footer">
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
