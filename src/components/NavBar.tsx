import { Link } from "react-router-dom"

function NavBar({active}: {active: number}) {
  return (
    <div className="navbar">
      <div className="logo">DecentraTube</div>
      <div className="nav-items">
        <div className={`navitem ${active == 1 && 'active' || ''}`}>
          <Link to='/'>
            Home
          </Link>
        </div>
        <div className={`navitem ${active == 2 && 'active' || ''}`}>
          <Link to='/upload-video'>
            Upload Video
          </Link>
        </div>
        <div className={`navitem ${active == 3 && 'active' || ''}`}>
          <Link to='/your-videos'>
            Your Videos
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NavBar