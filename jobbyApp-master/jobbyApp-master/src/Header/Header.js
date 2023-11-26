import {AiFillHome} from 'react-icons/ai'
import {FaSuitcase} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <>
      <nav className="nav-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            alt="website logo"
            className="logo"
          />
        </Link>

        <ul className="nav-list-container">
          <Link to="/" className="link">
            <li className="each-nav">Home</li>
          </Link>
          <Link to="/jobs" className="link">
            <li className="each-nav">Jobs</li>
          </Link>
          <li>
            <button
              type="button"
              className="login-button"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <nav className="mobile-nav-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png "
            alt="website logo"
            className="logo"
          />
        </Link>

        <ul className="link-card">
          <Link to="/" className="link">
            <li>
              <AiFillHome className="nav-list-icon" />
            </li>
          </Link>
          <Link to="/jobs" className="link">
            <li>
              <FaSuitcase className="nav-list-icon" />
            </li>
          </Link>
          <li>
            <FiLogOut className="nav-list-icon" onClick={onClickLogout} />
          </li>
        </ul>
      </nav>
    </>
  )
}

export default withRouter(Header)
