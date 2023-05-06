import Link from 'next/link'
import React, { FC } from 'react'
import { Container, Nav, NavDropdown, NavLink, Navbar, OverlayTrigger, Popover } from 'react-bootstrap'

interface NavbarBottomHeaderProps {
  version: number
}

const NavbarBottomHeader: FC<NavbarBottomHeaderProps> = (props: NavbarBottomHeaderProps) => {
  const { version } = props

  const getNavbarBottom = (_version: number) => {
    switch (_version) {
      case 1:
        return getNavbarBottomVersion1()
        break
      case 2:
        return getNavbarBottomVersion2()
        break
      case 3:
        return getNavbarBottomVersion3()
        break
      default:
        return null
    }
  }

  const getNavbarBottomVersion1 = () => {
    return (
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
    )
  }

  const getNavbarBottomVersion2 = () => {
    return (
      <div className="c-header-bottom">
        <Navbar variant="light">
          <Container>
            <Navbar.Brand href="/">
              <img src={'/images/cgvlogo.png'} width="150" height="70" alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <NavDropdown title="PHIM" id="movie">
                  <div className="nav-child">
                    <NavDropdown.Item href="/movie/movie_playing">Phim Đang Chiếu</NavDropdown.Item>
                    <NavDropdown.Item href="/movie/movie_upcoming">Phim Sắp Chiếu</NavDropdown.Item>
                  </div>
                </NavDropdown>
                <NavDropdown title="RẠP CGV" id="theater">
                  <div className="nav-child">
                    <NavDropdown.Item href="/theater/theater_all">Tất Cả Các Rạp</NavDropdown.Item>
                    <NavDropdown.Item href="/theater/theater_special">Rạp Đặc Biệt</NavDropdown.Item>
                    <NavDropdown.Item href="/theater/theater_upcoming">Rạp Sắp Mở</NavDropdown.Item>
                  </div>
                </NavDropdown>
                <NavDropdown title="THÀNH VIÊN" id="member">
                  <div className="nav-child">
                    <NavDropdown.Item href="/member/account">Tài Khoản CGV</NavDropdown.Item>
                    <NavDropdown.Item href="/member/right">Quyền Lợi</NavDropdown.Item>
                  </div>
                </NavDropdown>
                <NavDropdown title="CULTUREPLEX" id="cultureplex">
                  <div className="nav-child">
                    <NavDropdown.Item href="/quay-online">Quầy Online</NavDropdown.Item>
                    <NavDropdown.Item href="/event">Sự Kiện & Vé Nhóm</NavDropdown.Item>
                    <NavDropdown.Item href="/cgv-restaurant">Nhà Hàng CGV</NavDropdown.Item>
                    <NavDropdown.Item href="/gift">Thẻ Quà Tặng</NavDropdown.Item>
                  </div>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
            <div className="c-search-buy-infor">
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
    )
  }

  const popover = (_id: string) => {
    const getPopoverBody = (_id: string) => {
      switch (_id) {
        case 'movie':
          return (
            <Popover.Body>
              <Nav.Link href="/movie/movie_playing">Phim Đang Chiếu</Nav.Link>
              <Nav.Link href="/movie/movie_upcoming">Phim Sắp Chiếu</Nav.Link>
            </Popover.Body>
          )
          break
        case 'theater':
          return (
            <Popover.Body>
              <Nav.Link href="/theater/theater_all">Tất Cả Các Rạp</Nav.Link>
              <Nav.Link href="/theater/theater_special">Rạp Đặc Biệt</Nav.Link>
              <Nav.Link href="/theater/theater_upcoming">Rạp Sắp Mở</Nav.Link>
            </Popover.Body>
          )
          break
        case 'member':
          return (
            <Popover.Body>
              <Nav.Link href="/member/account">Tài Khoản CGV</Nav.Link>
              <Nav.Link href="/member/right">Quyền Lợi</Nav.Link>
            </Popover.Body>
          )
          break
        case 'cultureplex':
          return (
            <Popover.Body>
              <Nav.Link href="/quay-online">Quầy Online</Nav.Link>
              <Nav.Link href="/event">Sự Kiện & Vé Nhóm</Nav.Link>
              <Nav.Link href="/cgv-restaurant">Nhà Hàng CGV</Nav.Link>
              <Nav.Link href="/gift">Sự Kiện & Vé Nhóm</Nav.Link>
            </Popover.Body>
          )
          break
        default:
          return null
      }
    }

    return (
      <Popover id={_id} className="popover-header">
        {getPopoverBody(_id)}
      </Popover>
    )
  }

  const getNavbarBottomVersion3 = () => {
    return (
      <div className="c-header-bottom">
        <Navbar variant="light">
          <Container>
            <Navbar.Brand href="/">
              <img src={'/images/cgvlogo.png'} width="150" height="70" alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <OverlayTrigger trigger="click" placement="bottom-start" overlay={popover('movie')}>
                  <Navbar.Text>PHIM</Navbar.Text>
                </OverlayTrigger>
                <OverlayTrigger trigger="click" placement="bottom-start" overlay={popover('theater')}>
                  <Navbar.Text>RẠP CGV</Navbar.Text>
                </OverlayTrigger>
                <OverlayTrigger trigger="click" placement="bottom-start" overlay={popover('member')}>
                  <Navbar.Text>THÀNH VIÊN</Navbar.Text>
                </OverlayTrigger>
                <OverlayTrigger trigger="click" placement="bottom-start" overlay={popover('cultureplex')}>
                  <Navbar.Text>CULTUREPLEX</Navbar.Text>
                </OverlayTrigger>
              </Nav>
            </Navbar.Collapse>
            <div className="c-search-buy-infor">
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
    )
  }

  return (
    <React.Fragment>
      <>{getNavbarBottom(version)}</>
    </React.Fragment>
  )
}

export default NavbarBottomHeader
