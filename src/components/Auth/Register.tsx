import React, { FC, useState } from 'react'
import Link from 'next/link'
import { Button, Form } from 'react-bootstrap'
import { RULE_EMAIL } from '@src/contains/contants'
import { FormRegister } from '@src/interfaces/Auth'

interface RegisterProps {}

const Register: FC<RegisterProps> = (props: RegisterProps) => {
  const {} = props
  const Errmsg = ''
  const [form, setForm] = useState<Partial<FormRegister>>({})
  const [errors, setErrors] = useState<Partial<FormRegister>>({})

  const setField = (field, value) => {
    setForm({ ...form, [field]: value })
    // @ts-ignore
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const validateForm = () => {
    const { email, password, passwordConfirm, name } = form as FormRegister
    const newErrors: Partial<FormRegister> = {}
    if (!email) {
      newErrors.email = 'Vui lòng nhập email!'
    } else if (email && !RULE_EMAIL.pattern.test(email)) {
      newErrors.email = 'Email không đúng định dạng!'
    }
    if (!name) {
      newErrors.name = 'Vui lòng nhập tên'
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu!'
    }
    if (!passwordConfirm) {
      newErrors.passwordConfirm = 'Vui lòng nhập lại mật khẩu!'
    } else if (password && passwordConfirm && password != passwordConfirm) {
      newErrors.passwordConfirm = 'Mật khẩu và mật khẩu nhập lại không khớp!'
    }
    return newErrors
  }

  const handleSubmit = (e) => {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }
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
      <div className="register rounded d-none">
        <div className="register-header">
          <h2 className="text-center w-100 alert-link">Đăng ký</h2>
        </div>
        <p className="err mb-1 text-center" style={{ color: 'red' }}>
          {Errmsg}
        </p>
        <div className="register-body my-3">
          <form>
            <div className="form-group my-2">
              <label>
                Email:
                <input
                  type="email"
                  placeholder="Nhập email"
                  className="form-control"
                  name="email"
                  id="email"
                  required
                />
              </label>
            </div>
            <div className="form-group my-2">
              <label>
                Tên người dùng:
                <input type="text" placeholder="Nhập tên" className="form-control" name="name" id="name" required />
              </label>
            </div>
            <div className="form-group my-2">
              <label>
                Mật khẩu:
                <input
                  type="password"
                  placeholder="Nhập mật khẩu"
                  className="form-control"
                  name="password"
                  id="password"
                  required
                />
              </label>
            </div>
            <div className="form-group my-2">
              <label>
                Nhập lại mật khẩu:
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  className="form-control"
                  name="password-confirmation"
                  id="password-confirmation"
                  required
                />
              </label>
            </div>
            <div className="form-group my-2 form-check">
              <label className="form-check-label">
                <input className="form-check-input" type="checkbox" id="gridCheck" required />
                <p>
                  Tôi đã đọc và đồng ý các điều kiện
                  <Link href="/thoathuan"> Thỏa thuận sử dụng</Link>.
                </p>
              </label>
            </div>
            <div className="form-group my-2">
              <button type="submit" className="btn btn-danger btn-block btn-lg w-100">
                Đăng ký
              </button>
            </div>
          </form>
        </div>
        <div className="register-footer">
          <p>
            Bạn đã có tài khoản rồi?{' '}
            <Link href="/auth/login" className="text-primary">
              Đăng nhập
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="c-form">
        <div className="c-form__title">
          <h2>Đăng ký</h2>
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
            <Form.Group className="mb-4" controlId="name">
              <Form.Control
                type="text"
                placeholder="Tên người dùng"
                onChange={(e) => setField('name', e.target.value)}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
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
            <Form.Group className="mb-3" controlId="terms">
              <Form.Check
                required
                label={
                  <div>
                    Tôi đã đọc và đồng ý các điều kiện{' '}
                    <Link href="/auth/thoa-thuan" className="text-primary">
                      Thỏa thuận sử dụng.
                    </Link>
                  </div>
                }
                feedback="Vui lòng chọn hộp kiểm này nếu bạn muốn tiếp tục"
                feedbackType="invalid"
                // feedbackTooltip
                // name="terms12"
                // onChange={(e) => setField('terms', e.target.value)}
                // isInvalid={!!errors.terms}
              />
              {/* <Form.Control.Feedback type="invalid">{errors.terms}</Form.Control.Feedback> */}
            </Form.Group>
            <Form.Group controlId="submit">
              <Button variant="danger" type="submit" className="w-100" onClick={handleSubmit}>
                Đăng ký
              </Button>
            </Form.Group>
          </Form>
        </div>
        <div className="c-form__bottom">
          <div>
            Bạn đã có tài khoản rồi?{' '}
            <Link href="/auth/login" className="text-primary">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
