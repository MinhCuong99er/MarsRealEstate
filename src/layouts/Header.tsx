import React, { FC } from 'react'
import { Button, ButtonGroup, Container, Nav, NavLink, Navbar } from 'react-bootstrap'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LANGUAGE } from '@src/interfaces/enums'
import { LANGUAGE_ARRAY } from '@src/contains/contants'
import NavbarBottomHeader from '@src/components/common/NavbarBottomHeader'

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
              <Nav.Link href="/auth/login" className={`${router.pathname === '/auth/login' ? 'is-active' : ''}`}>
                <i className="bi bi-ticket-detailed"></i>
                <span>Đăng nhập</span>
              </Nav.Link>
              <Nav.Link href="/auth/register" className={`${router.pathname === '/auth/register' ? 'is-active' : ''}`}>
                <i className="bi bi-person-plus-fill"></i>
                <span>Đăng ký</span>
              </Nav.Link>
            </Nav>
            <ButtonGroup>
              {LANGUAGE_ARRAY.map((item) => (
                <Button
                  key={`language-${item}`}
                  variant={router?.locale == item ? 'secondary' : 'primary'}
                  onClick={() => onChangeLanguage(item)}
                >
                  {item.toUpperCase()}
                </Button>
              ))}
            </ButtonGroup>
          </Container>
        </Navbar>
        <NavbarBottomHeader version={2} />
      </div>
    </React.Fragment>
  )
}

export default Header
