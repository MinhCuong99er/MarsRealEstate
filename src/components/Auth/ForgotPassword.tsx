import React, { FC } from 'react'

interface ForgotPasswordProps {}

const ForgotPassword: FC<ForgotPasswordProps> = (props: ForgotPasswordProps) => {
  const {} = props
  const msgErr = ''
  return (
    <div className="login rounded">
      <div className="login-header">
        <h2 className="text-center w-100 alert-link">Lấy lại mật khẩu</h2>
      </div>
      <p className="mb-0 ml-4 text-center" style={{ color: 'red' }}>
        {msgErr}
      </p>
      <div className="login-body my-3">
        <form>
          <div className="form-group my-4">
            <input type="email" className="form-control" placeholder="Email của bạn" />
          </div>
          <div className="form-group my-4">
            <input type="password" className="form-control" placeholder="Nhập mật khẩu mới" />
          </div>
          <div className="form-group my-4">
            <input type="password" className="form-control" placeholder="Nhập lại mật khẩu mới" />
          </div>
          <div className="form-group my-4">
            <button type="submit" className="btn btn-danger btn-block btn-lg">
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
