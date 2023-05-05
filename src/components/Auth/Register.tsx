import React, { FC } from 'react'
import Link from 'next/link'

interface RegisterProps {}

const Register: FC<RegisterProps> = (props: RegisterProps) => {
  const {} = props
  const Errmsg = ''
  return (
    <div className="register rounded">
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
              <input type="email" placeholder="Nhập email" className="form-control" name="email" id="email" required />
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
  )
}

export default Register
