import { NavLink } from "react-router-dom"

function Header() {
    return (
        <nav className="nav-bar">
            <NavLink to={'/'}>Photo-Tagging-App</NavLink>

            <ul className="nav-links">
                <li>
                    <NavLink to='/'>Menu</NavLink>
                </li>
                <li>
                    <NavLink to='/Info'>Info</NavLink>
                </li>
                <li>
                    <NavLink to='/leaderboard'>Leaderboard</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Header