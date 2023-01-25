import { NavLink, Link, useLocation } from "react-router-dom"
import { useEffect, useRef } from "react"

function Header() {
    const navRef = useRef()

    const changeColor = () => {
        let scroll = window.scrollY
        if (!scroll) return

        if (scroll >= 10) {
            navRef.current.classList.add('scrolled')
            return
        }
        navRef.current.classList.remove('scrolled')
    }

    useEffect(() => {
        window.addEventListener('scroll', changeColor)

        return ()=>window.removeEventListener('scroll', changeColor)
    }, [])



    return (
        <nav className="nav-bar" ref={navRef}>
            <Link to={'/'} className='app-logo'>Photo-Tagging-App</Link>

            <ul className="nav-links">
                <li>
                    <NavLink onClick={changeColor} className='nav-link' to='/'>Menu</NavLink>
                </li>
                <li>
                    <NavLink onClick={changeColor} className='nav-link' to='/Info'>Info</NavLink>
                </li>
                <li>
                    <NavLink onClick={changeColor} className='nav-link' to='/leaderboard'>Leaderboard</NavLink>
                </li>
            </ul>
        </nav>
    )
}

export default Header