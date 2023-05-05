import React, { FC } from 'react'
import Link from 'next/link'

interface LoginProps {}

const Login: FC<LoginProps> = (props: LoginProps) => {
  const {} = props
  const msgErr = ''
  return (
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
  )
}

export default Login
