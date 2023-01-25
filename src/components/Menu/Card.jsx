import { collection, getDocs, getFirestore, limit, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

function Card({characters,  mapName:name, level, mapImg}){
    const [bestTime, setBestTime] = useState()

    const fetchBestTime = async () =>{
        let q = query(collection(getFirestore(), `leaderboard-${level + 1}`), where('timeOffset', '>', 0), orderBy('timeOffset'), limit(1))
        let docs = await (await getDocs(q)).docs[0].data()
        setBestTime((docs.timeOffset / 1000).toFixed(2))
    }

    useEffect(()=>{
        fetchBestTime()
    }, [])
    return (
        <Link to={`/map/${level + 1}`} className="menu-card">
            <div className="menu-card-back card-face">
                <h3 className="menu-map-name">{name}</h3>
                {characters.map(char=>(
                    <div className="menu-char">
                        <img className="menu-card-char" src={char.characterImg} alt="Character"/>
                        <span className="menu-character-name">{char.characterName}</span>
                    </div>
                ))}
                <div className="menu-card-best-time">{bestTime}s</div>
            </div>
            <div className="menu-card-front card-face">
                <img src={mapImg} alt="" className="menu-card-preview"/>
            </div>
        </Link>
    )
}

export default Card