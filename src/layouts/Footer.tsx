import Link from 'next/link'
import React, { FC } from 'react'

interface FooterProps {}

const Footer: FC<FooterProps> = (props: FooterProps) => {
  const {} = props

  return (
    <React.Fragment>
      <div className="footer">
        <div className="footer-brand-slide">
          <div className="container d-flex align-items-center justify-content-between mx-auto p-0">
            <div>
              <Link href="4dx">
                <img src="/images/logo-4dx.png" />
              </Link>
            </div>
            <div>
              <Link href="imax">
                <img src="/images/logo-imax.png" />
              </Link>
            </div>
            <div>
              <Link href="screenx">
                <img src="/images/logo-screenx.png" />
              </Link>
            </div>
            <div>
              <Link href="starium">
                <img src="/images/logo-starium.png" />
              </Link>
            </div>
          </div>
        </div>
        <div className="footer-policy">
          <div className="container d-flex align-items-center justify-content-between mx-auto p-0">
            <div className="col">
              <h3>CGV Việt Nam</h3>
              <ul>
                <li>Giới thiệu</li>
                <li>Tiện ích Online</li>
                <li>Thẻ quà tặng</li>
                <li>Tuyển dụng</li>
                <li>Liên hệ quảng cáo</li>
              </ul>
            </div>
            <div className="col">
              <h3>Điều khoản sử dụng</h3>
              <ul>
                <li>Điều khoản chung</li>
                <li>Điều khoản giao dịch</li>
                <li>Chính sách thanh toán</li>
                <li>Chính sách bảo mật</li>
                <li>Câu hỏi thường gặp</li>
              </ul>
            </div>
            <div className="col">
              <h3>Kết nối với chúng tôi</h3>
              <div className="icon-follow">
                <ul>
                  <li>
                    <a className="zoom-icon" id="fb"></a>
                  </li>
                  <li>
                    <a className="zoom-icon" id="youtube"></a>
                  </li>
                  <li>
                    <a className="zoom-icon" id="line"></a>
                  </li>
                  <li>
                    <a className="zoom-icon" id="insta"></a>
                  </li>
                  <li>
                    <a className="zoom-icon" id="zalo"></a>
                  </li>
                </ul>
              </div>
              <div className="cgv-premission"></div>
            </div>
            <div className="col">
              <h3>Chăm sóc khách hàng</h3>
              <p>
                Hotline: 1900 6017 <br />
                Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày bao gồm cả Lễ Tết) <br />
                Email hỗ trợ: <a href="mailto:hoidap@cgv.vn">hoidap@cgv.vn</a>
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto footer-address row mt-1">
          <div className="logo-cgv col-3"></div>
          <div className="col-9 text-cgv-address">
            <h3>CÔNG TY TNHH CJ CGV VIETNAM</h3>
            <p>
              Giấy CNĐKDN: 0303675393, đăng ký lần đầu ngày 31/7/2008, đăng ký thay đổi lần thứ 5 ngày 14/10/2015, cấp
              bởi Sở KHĐT thành phố Hồ Chí Minh.
            </p>
            <p>Địa Chỉ: Tầng 2, Rivera Park Saigon - Số 7/28 Thành Thái, P.14, Q.10, TPHCM.</p>
            <p>Hotline: 1900 6017</p>
            <p>COPYRIGHT 2017 CJ CGV. All RIGHTS RESERVED .</p>
          </div>
        </div>
        <div className="row" style={{ height: '100px' }}>
          <div className="col-12 bg-footer"></div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Footer
