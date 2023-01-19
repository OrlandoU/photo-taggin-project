import '../../assets/css/Map.css'
import { useState } from "react"

function Map(){
    const [positionX, setPositionX] = useState()
    const [positionY, setPositionY] = useState()

    const handleClick = (e) => {
        setPositionX((e.pageX - e.target.offsetLeft) / e.target.offsetWidth)
        setPositionY((e.pageY - e.target.offsetTop) / e.target.offsetHeight)
    }

    return (
        <main>
            <span>X:{positionX}, Y:{positionY}</span>
            <div className="testing-ground" onClick={handleClick}>
            </div>
        </main>
    )
}

export default Map