import { Link } from "react-router-dom"

function Card(props){
    return (
        <Link to={'/map'} className="menu-card">
            <div className="menu-card-back card-face"></div>
            <div className="menu-card-front card-face">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis molestie nibh id eros ullamcorper, ac maximus augue porta. Nulla a enim facilisis sem dapibus consequat ut et turpis. Vestibulum vitae eros gravida, aliquet quam eget, lacinia felis. 
            </div>
        </Link>
    )
}

export default Card