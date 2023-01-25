import { useEffect } from "react"
import Maps from "../../assets/Maps"
import LeaderBoardCard from "./LeaderboardCard"

function LeaderBoard() {  
    useEffect(()=>{
        return ()=> {
            document.querySelector('.nav-bar').classList.remove('scrolled')
        }
    }, []) 
    return (
        <main>
            <h1 className="leaderboard-title">Leaderboards</h1>
            <div className="leaderboards-container">
                {Maps.map((map, index) => (
                    <LeaderBoardCard {...map} key={index} level={index + 1} />
                ))}
            </div>
        </main>
    )
}

export default LeaderBoard