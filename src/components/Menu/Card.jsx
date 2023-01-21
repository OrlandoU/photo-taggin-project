import { Link } from "react-router-dom"

function Card(props){

    return (
        <Link to={`/map/${props.level + 1}`} className="menu-card">
            <div className="menu-card-back card-face">
                
            </div>
            <div className="menu-card-front card-face">
                <img src={props.mapImg} alt="" className="menu-card-preview"/>
            </div>
        </Link>
    )
}

export default Card