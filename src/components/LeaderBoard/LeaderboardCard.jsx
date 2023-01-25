import { collection, getDocs, getFirestore, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import '../../assets/css/LeaderBoard.css'

function LeaderBoardCard({mapImg, mapName, level}) {
    const [attempts, setAttempts] = useState()

    const fetchAttempts = async () => {
        let q = query(collection(getFirestore(), `leaderboard-${level}`), where('timeOffset', '>', 0), orderBy('timeOffset'))
        let docs = await getDocs(q)
        setAttempts(docs.size)
    }

    useEffect(()=>{
        fetchAttempts()
    }, [])

    return (
        <Link to={`./${level}`} className="leaderboard-card">
            <img src={mapImg} alt="Map leaderboard" className="leaderboard-map-preview"/>
            <div className="leader-map-info">
                <h2>{mapName}</h2>                                                                                                        
                <div className="leaderboard-attempts">
                    <span> Attempts done on this map</span>
                    <span className="attempts-count">{attempts}</span>
                    </div>
            </div>
         </Link>
    ) 
}
export default LeaderBoardCard