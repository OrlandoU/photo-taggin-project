import { collection, getDocs, getFirestore, limit, orderBy, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Maps from "../../assets/Maps"
import BottomPlace from "./BottomPlace"

function LeaderboardRouted() {
    const level = useParams().level
    const [leaderboard, setLeaderboard] = useState([])

    const fetchLeaderboard = async () => {
        const q = query(collection(getFirestore(), `leaderboard-${level}`), where('timeOffset', '>', 0) ,orderBy('timeOffset'), limit(100))
        let docs = await getDocs(q)
        let arr = docs.docs.map(doc => doc.data())
        console.log(arr)
        setLeaderboard(arr)
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    console.log(leaderboard)

    return (
        <main>
            <h1 className="routed-board-map-name">{Maps[level - 1].mapName}</h1>
            {leaderboard.length
                ? <>
                    <div className="top-board">
                        <div className="leaderboard-second-place top-place">
                            <img src="https://cdn-icons-png.flaticon.com/512/2385/2385865.png" alt="Second place"/>
                            <span className="place-name">{leaderboard[1] ? leaderboard[1].userName || '-' : '-'}</span>
                            <span className="place-time">{leaderboard[1] ? (leaderboard[1].timeOffset / 1000).toFixed(2) + 's' || '-' : '-'}</span>
                        </div>
                        <div className="leaderboard-first-place top-place">
                            <img src="https://cdn-icons-png.flaticon.com/512/2385/2385865.png" alt="Second place" />
                            <span className="place-name">{leaderboard[0] ? leaderboard[0].userName : '-'}</span>
                            <span className="place-time">{leaderboard[0] ? (leaderboard[0].timeOffset / 1000).toFixed(2) + 's' || '-' : '-'}</span>

                        </div>
                        <div className="leaderboard-third-place top-place">
                            <img src="https://cdn-icons-png.flaticon.com/512/2385/2385865.png" alt="Second place" />
                            <span className="place-name">{leaderboard[2] ?leaderboard[2].userName: '-' }</span>
                            <span className="place-time">{leaderboard[2] ? (leaderboard[2].timeOffset / 1000).toFixed(2) + 's' || '-' : '-'}</span>
                        </div>
                    </div>
                    {leaderboard.length > 3 && <div className="bottom-board">
                        {leaderboard.slice(3).map((place, index)=>
                            <BottomPlace {...place} key={place.timeOffset} place={index + 3}/>
                        )}
                    </div>}
                </>
                : null}
        </main>
    )
}

export default LeaderboardRouted