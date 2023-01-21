import Card from "./Card"
import '../../assets/css/Menu.css'
import Maps from "../../assets/Maps"

function Menu() {
    return <main>
        <h1>Select a Map</h1>
        <div className="cards-container">
            {Maps.map((map, index)=>(
                <Card {...map} level={index} key={index}/>
            ))}
        </div>
    </main>
}

export default Menu