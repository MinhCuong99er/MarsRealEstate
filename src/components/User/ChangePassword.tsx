import React, { FC, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { RULE_EMAIL, RULE_PHONE } from '@src/contains/contants'
import { FormChangeInfo } from '@src/interfaces/Auth'
import province from '@src/helpers/dataMap/province.json'

interface ChangePasswordProps {}

const ChangePassword: FC<ChangePasswordProps> = (props: ChangePasswordProps) => {
  const {} = props
  const [form, setForm] = useState<Partial<FormChangeInfo>>({})
  const [errors, setErrors] = useState<any>({})

  const setField = (field, value) => {
    setForm({ ...form, [field]: value })
    // @ts-ignore
    if (errors[field]) {
      setErrors({ ...errors, [field]: null })
    }
  }

  const validateForm = () => {
    const { email, name, province, phone, address } = form as FormChangeInfo
    const newErrors: any = {}
    if (!email) {
      newErrors.email = 'Please fill email'
    } else if (email && !RULE_EMAIL.pattern.test(email)) {
      newErrors.email = 'Please validate email'
    }
    if (!name) {
      newErrors.name = 'Please fill name'
    }
    if (!address) {
      newErrors.address = 'Please fill address'
    }
    if (!province) {
      newErrors.province = 'Please fill province'
    }
    if (!phone) {
      newErrors.phone = 'Please fill phone'
    } else if (phone && !RULE_PHONE.pattern.test(phone.toString())) {
      newErrors.phone = 'Please validate phone'
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
          <h2>Sửa thông tin cá nhân</h2>
        </div>
        <div className="c-form__body">
          <Form>
            <Form.Group className="mb-4" controlId="name">
              <Form.Control
                type="text"
                placeholder="Tên người dùng"
                onChange={(e) => setField('name', e.target.value)}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) => setField('email', e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="phone">
              <Form.Control
                type="number"
                placeholder="Số điện thoại"
                onChange={(e) => setField('phone', e.target.value)}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="address">
              <Form.Control
                type="text"
                placeholder="Địa chỉ"
                onChange={(e) => setField('address', e.target.value)}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="province">
              <Form.Select onChange={(e) => setField('province', e.target.value)} isInvalid={!!errors.province}>
                <option>Tỉnh/Thành phố</option>
                {province.RECORDS.map((item) => {
                  return (
                    <option value={item.id} key={`province-${item.id}`}>
                      {item.name}
                    </option>
                  )
                })}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="submit">
              <Button variant="danger" type="submit" className="w-100" onClick={handleSubmit}>
                Cập nhật
              </Button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </>
  )
}

export default ChangePassword
