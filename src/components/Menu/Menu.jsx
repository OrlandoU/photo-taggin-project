import Card from "./Card"
import '../../assets/css/Menu.css'

function Menu() {
    return <main>
        <h1>Select a Map</h1>
        <div className="cards-container">
            <Card />
            <Card />
            <Card />
            <Card />
        </div>
    </main>
}

export default Menu