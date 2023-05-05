import React, { FC } from 'react'
import { Button, ButtonGroup, Container, Nav, NavDropdown, NavLink, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LANGUAGE } from '@src/interfaces/enums'
import { LANGUAGE_ARRAY } from '@src/contains/contants'

interface HeaderProps {}

const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const {} = props
  const router = useRouter()
  const user = {
    name: '',
  }

  const onChangeLanguage = (lang: LANGUAGE) => {
    router.push(router.asPath, undefined, { locale: lang })
  }

  return (
    <React.Fragment>
      <div className="c-header">
        <div className="c-header-top container header-language-background p-1 clearfix d-none">
          <div className="navbar navbar-expand-sm navbar-light bg-light float-right p-0">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-Navlink p-0" href="/news">
                  <i className="fa fa-newspaper-o mr-5px" aria-hidden="true"></i>Tin mới & ưu đãi
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-Navlink p-0" href="/my_ticket">
                  <i className="fa fa-ticket mr-5px" aria-hidden="true"></i>Vé của tôi
                </NavLink>
              </li>
              <li className="nav-item show-menu">
                {user ? (
                  <>
                    <NavLink className="nav-Navlink p-0" href="/user">
                      <i className="fa fa-user-circle mr-5px" aria-hidden="true"></i>
                      <span>{user.name}</span>
                    </NavLink>
                    <div className="menu">
                      <div className="list-menu d-flex flex-column">
                        <NavLink href="/user/change_info" className="">
                          Sửa thông tin
                        </NavLink>
                        <NavLink href="/user/change_password" className="">
                          Đổi mật khẩu
                        </NavLink>
                      </div>
                    </div>
                  </>
                ) : (
                  <NavLink className="nav-Navlink p-0" href="/user/login">
                    <i className="fa fa-sign-in mr-5px" aria-hidden="true"></i>Đăng nhập
                  </NavLink>
                )}
              </li>
              <li className="nav-item ">
                {user ? (
                  <Link className="nav-Navlink p-0" href="/user/login">
                    <a>
                      <i className="fa fa-sign-out mr-5px" aria-hidden="true"></i>Đăng xuất
                    </a>
                  </Link>
                ) : (
                  <NavLink className="nav-Navlink p-0" href="/user/register">
                    <i className="fa fa-user-plus mr-5px" aria-hidden="true"></i>Đăng ký
                  </NavLink>
                )}
              </li>
              <li className="nav-item">
                <NavLink className="nav-Navlink" href="/vn" id="VN">
                  VN
                </NavLink>
                <NavLink className="nav-Navlink" href="/en" id="EN">
                  EN
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <Navbar variant="light" className="c-header-top">
          <Container>
            <Nav>
              <Nav.Link href="/news" className={`${router.pathname === '/news' ? 'is-active' : ''}`}>
                <i className="bi bi-newspaper"></i>
                <span>Tin mới & ưu đãi</span>
              </Nav.Link>
              <Nav.Link href="/my-ticket" className={`${router.pathname === '/my-ticket' ? 'is-active' : ''}`}>
                <i className="bi bi-ticket-detailed"></i>
                <span>Vé của tôi</span>
              </Nav.Link>
              <Nav.Link href="/login" className={`${router.pathname === '/login' ? 'is-active' : ''}`}>
                <i className="bi bi-ticket-detailed"></i>
                <span>Đăng nhập</span>
              </Nav.Link>
              <Nav.Link href="/register" className={`${router.pathname === '/register' ? 'is-active' : ''}`}>
                <i className="bi bi-person-plus-fill"></i>
                <span>Đăng ký</span>
              </Nav.Link>
            </Nav>
            <ButtonGroup>
              {LANGUAGE_ARRAY.map((item) => (
                <Button
                  key={`language${item}`}
                  variant={router?.locale == item ? 'secondary' : 'primary'}
                  onClick={() => onChangeLanguage(item)}
                >
                  {item.toUpperCase()}
                </Button>
              ))}
            </ButtonGroup>
          </Container>
        </Navbar>
        <div className="c-header-bottom">
          <nav className="container navbar navbar-expand-lg navbar-light">
            <NavLink className="navbar-brand" href="/">
              <img src={'/images/cgvlogo.png'} width="150" height="70" alt="logo" />
            </NavLink>
            <div className="navbar mt-4">
              <ul className="navbar-nav">
                <li className="nav-item position-relative show-menu">
                  <NavLink className="nav-Navlink text-dark alert-link" href="/movie">
                    PHIM
                  </NavLink>
                  <div className="menu">
                    <div className="list-menu d-flex flex-column">
                      <NavLink href="/movie/movie_playing" className="">
                        Phim Đang Chiếu
                      </NavLink>
                      <NavLink href="/movie/movie_upcoming" className="">
                        Phim Sắp Chiếu
                      </NavLink>
                    </div>
                  </div>
                </li>
                <li className="nav-item position-relative show-menu">
                  <NavLink className="nav-Navlink text-dark alert-link" href="/theater">
                    RẠP CGV
                  </NavLink>
                  <div className="menu">
                    <div className="list-menu d-flex flex-column">
                      <NavLink href="/theater/theater_all" className="">
                        Tất Cả Các Rạp
                      </NavLink>
                      <NavLink href="/theater/theater_special" className="">
                        Rạp Đặc Biệt
                      </NavLink>
                      <NavLink href="/theater/theater_upcoming" className="">
                        Rạp Sắp Mở
                      </NavLink>
                    </div>
                  </div>
                </li>
                <li className="nav-item position-relative show-menu">
                  <NavLink className="nav-Navlink text-dark alert-link" href="/member">
                    THÀNH VIÊN
                  </NavLink>
                  <div className="menu">
                    <div className="list-menu d-flex flex-column">
                      <NavLink href="/member/account" className="">
                        Tài Khoản CGV
                      </NavLink>
                      <NavLink href="/member/right" className="">
                        Quyền Lợi
                      </NavLink>
                    </div>
                  </div>
                </li>
                <li className="nav-item position-relative show-menu">
                  <NavLink className="nav-Navlink text-dark alert-link" href="/cultureplex">
                    CULTUREPLEX
                  </NavLink>
                  <div className="menu">
                    <div className="list-menu d-flex flex-column">
                      <NavLink href="/quay_online" className="">
                        Quầy Online
                      </NavLink>
                      <NavLink href="/event" className="">
                        Sự Kiện & Vé Nhóm
                      </NavLink>
                      <NavLink href="cgv_restaurant" className="">
                        Nhà Hàng CGV
                      </NavLink>
                      <NavLink href="/gif" className="">
                        Thẻ Quà Tặng
                      </NavLink>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="search-buy-infor">
              <a href="#" className="news">
                <img src={'/images/kenhcine.gif'} alt="" />
              </a>
              <a href="#" className="buy-tickets">
                <img src={'/images/banner/banner-mua-ve-ngay.png'} alt="" />
              </a>
            </div>
          </nav>
        </div>
        <div className="c-header-bottom">
          <Navbar variant="light" className="c-header-top">
            <Container>
              <Navbar.Brand href="/">
                <img src={'/images/cgvlogo.png'} width="150" height="70" alt="logo" />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Nav id="basic-navbar-nav">
                <NavDropdown title="PHIM" id="movie">
                  <NavDropdown.Item href="/movie/movie_playing">Phim Đang Chiếu</NavDropdown.Item>
                  <NavDropdown.Item href="/movie/movie_upcoming">Phim Sắp Chiếu</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="RẠP CGV" id="theater">
                  <NavDropdown.Item href="/theater/theater_all">Tất Cả Các Rạp</NavDropdown.Item>
                  <NavDropdown.Item href="/theater/theater_special">Rạp Đặc Biệt</NavDropdown.Item>
                  <NavDropdown.Item href="/theater/theater_upcoming">Rạp Sắp Mở</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="THÀNH VIÊN" id="member">
                  <NavDropdown.Item href="/member/account">Tài Khoản CGV</NavDropdown.Item>
                  <NavDropdown.Item href="/member/right">Quyền Lợi</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="CULTUREPLEX" id="cultureplex">
                  <NavDropdown.Item href="/quay-online"> Quầy Online</NavDropdown.Item>
                  <NavDropdown.Item href="/event">Sự Kiện & Vé Nhóm</NavDropdown.Item>
                  <NavDropdown.Item href="/cgv-restaurant">Nhà Hàng CGV</NavDropdown.Item>
                  <NavDropdown.Item href="/gift">Thẻ Quà Tặng</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <div className="search-buy-infor">
                <Link href="#">
                  <a className="news">
                    <img src={'/images/kenhcine.gif'} alt="" />
                  </a>
                </Link>
                <Link href="#">
                  <a className="buy-tickets">
                    <img src={'/images/banner/banner-mua-ve-ngay.png'} alt="" />
                  </a>
                </Link>
              </div>
            </Container>
          </Navbar>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Header
