import { useState } from "react"
import { getDoc, doc, getFirestore, updateDoc, setDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

function HoverMenuItem(props) {
    const [founded, setFounded] = useState(false)
    const [position, setPosition] = useState({})
    const url = useParams()

    const isInRadius = async (mousePositionX, mousePositionY, radius) => {
        if (!mousePositionX) return
        let distance = Math.sqrt(Math.pow((mousePositionX - position.x), 2) + Math.pow((mousePositionY - position.y), 2))
        return distance < radius
    }

    const handleClick = async () => {
        let timestamp = new Date().getTime()
        let check = await isInRadius(props.mousePositionX, props.mousePositionY, 0.02)
        if (check) {
            setFounded(prevState => {
                if (!prevState) {
                    updateDoc(doc(getFirestore(), `leaderboard-${url.level}`, props.uniqueId.toString()), {
                        [props.characterName]: timestamp
                    }).then(()=>{
                        props.setItemFounded()
                    }
                    ).catch(() => {
                        setDoc(doc(getFirestore(), `leaderboard-${url.level}`, props.uniqueId.toString()), {
                            [props.characterName]: timestamp
                        })
                        props.setItemFounded()
                    })

                }
                return true
            })
        }
    }

    const fetchPosition = async (name) => {
        let position = await (await getDoc(doc(getFirestore(), 'locations', name))).data()
        setPosition(position)
    }
    useEffect(() => {
        fetchPosition(props.characterName)
    }, [])

    return (
        <div onClick={handleClick} className={founded ? 'hover-item grayOut' : 'hover-item'}>
            <img src={props.characterImg} alt="Character" className="hover-image" />
            <div className="hover-charName">{props.characterName}</div>
        </div>
    )
}
export default HoverMenuItem