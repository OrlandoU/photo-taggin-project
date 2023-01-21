import '../../assets/css/Map.css'
import Maps from '../../assets/Maps'
import HoverMenuItem from './HoverMenu'
import { useState, useRef, useEffect } from "react"
import { useParams } from 'react-router-dom'
import { doc, getFirestore, setDoc, getDoc, deleteDoc, collection, addDoc, query, limit, getDocs, orderBy, updateDoc } from 'firebase/firestore'
import CharacterScore from './CharacterScore'

function Map(props) {
    const [place, setPlace] = useState()
    const [timeOffset, setTimeOffset] = useState()
    const [charTimes, setCharTimes] = useState({})
    const [mapInfo, setMap] = useState({})
    const [animated, setAnimate] = useState(false)
    const url = useParams()
    const hoverRef = useRef()
    const waveRef = useRef()
    const [menuItems, setMenuItems] = useState(0)
    const [positionX, setPositionX] = useState()
    const [positionY, setPositionY] = useState()


    const handleClick = (e) => {
        let elementTop = e.currentTarget.getBoundingClientRect().top + window.scrollY
        let elementLeft = e.currentTarget.getBoundingClientRect().left + window.scrollX
        hoverRef.current.style.display = 'flex'
        waveRef.current.style.display = 'block'
        setAnimate(false)
        setPositionY((e.pageY - elementTop) / e.currentTarget.offsetHeight)
        setPositionX((e.pageX - elementLeft) / e.currentTarget.offsetWidth)
        let offsetHeight = window.innerHeight - (hoverRef.current.offsetHeight + 50)
        let offsetWidth = window.innerWidth - (hoverRef.current.offsetWidth + 50)
        hoverRef.current.style.left = e.clientX > offsetWidth ? ((e.pageX - elementLeft) - (hoverRef.current.offsetWidth)) + 'px' : (e.pageX - elementLeft) + 'px';
        hoverRef.current.style.top = e.clientY > offsetHeight ? ((e.pageY - elementTop) - (hoverRef.current.offsetHeight)) + 'px' : (e.pageY - elementTop) + 'px';
        waveRef.current.style.left = (e.pageX - elementLeft) + 'px'
        waveRef.current.style.top = (e.pageY - elementTop) + 'px'
        restartAnimation()
    }

    const restartAnimation = () => {
        setAnimate(true)
    }

    const handleAnimation = (e) => {
        setAnimate(false)
    }

    const setItemFounded = () => {
        setMenuItems(prevState => prevState + 1)
    }

    const getUniqueId = async () => {
        let startTimestamp = new Date().getTime()
        let rndNum = Math.random() * 10
        try {
            let attempt = await getDoc(doc(getFirestore(), `leaderboard=${url.level}`, rndNum.toString()))
            if (!attempt.data()) {
                await updateDoc(doc(getFirestore(), `leaderboard-${url.level}`, rndNum.toString()), {
                    startTimestamp
                }).catch(() => {
                    setDoc(doc(getFirestore(), `leaderboard-${url.level}`, rndNum.toString()), {
                        startTimestamp
                    })
                })
                props.setUniqueId(rndNum)
            }
            else {
                getUniqueId()
            }
        } catch (error) {
            console.error('Error generating unique id and timestamp', error)
        }

    }

    const calcTime = async () => {
        let endTimestamp = new Date().getTime()
        let startTimestamp = await getDoc(doc(getFirestore(), `leaderboard-${url.level}`, props.uniqueId.toString()))
        setTimeOffset(endTimestamp - startTimestamp.data().startTimestamp)
        return endTimestamp - startTimestamp.data().startTimestamp
    }

    const getPlace = async (offset) => {
        let leaderboard = query(collection(getFirestore(), `leaderboard-${url.level}`), orderBy('startTimestamp'), limit(100))
        let docs = await getDocs(leaderboard)
        if (!docs.size) {
            setPlace(docs.size + 1)
        }
        docs.forEach(async (doc, index) => {
            if (doc.data().time > offset) {
                setPlace(index)
                return
            }
        })
        if (docs.size < 100) setPlace(docs.size)
        let matchData = await getDoc(doc(getFirestore(), `leaderboard-${url.level}`, props.uniqueId.toString()))
        setCharTimes(matchData.data())
    }

    useEffect(() => {
        let removeHover = () => {
            hoverRef.current.style.display = 'none'
            waveRef.current.style.display = 'none'
        }
        window.addEventListener('scroll', removeHover)
        setMap(Maps[url.level - 1])
        getUniqueId()

        return () => {
            window.removeEventListener('scroll', removeHover)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        return () => {
            if (props.uniqueId) deleteDoc(doc(getFirestore(), 'id', props.uniqueId.toString()))
        }
    }, [props.uniqueId])

    useEffect(() => {
        if (menuItems >= 3) {
            calcTime().then((val) => {
                getPlace(val)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuItems])

    console.log(charTimes)
    return (
        <main>
            <span>Place: {place}</span>
            <span>X: {positionX}, Y: {positionY}</span>
            <div className="testing-ground" onClick={handleClick}>
                <img src={mapInfo.mapImg} alt='Map' className='Map' />
                <div className="hover-menu" ref={hoverRef} onClick={(e) => e.stopPropagation()}>
                    <div className="hover-container">
                        {mapInfo.characters && mapInfo.characters.map((char, index) => <HoverMenuItem mousePositionX={positionX} uniqueId={props.uniqueId} mousePositionY={positionY} setItemFounded={setItemFounded} {...char} key={index} />)}
                    </div>
                </div>
                <div className={animated ? 'wave-click animate' : "wave-click"} ref={waveRef} onAnimationEnd={handleAnimation}>
                    <div className="first-circle" ></div>
                    <div className="second-circle" ></div>
                    <div className="third-circle" ></div>
                </div>
            </div>
            {mapInfo.characters
                && <div className='map-endgame-modal'>
                    <div className="map-retry-game"></div>
                    <form action="" className="map-bestscore-form">
                        <h1>Congrats!</h1>
                        <span>You placed in the top 100! Keep pushing for greatness!</span>
                        <div className="container">
                            <div className="medal icon--star" data-place={place}></div>
                            <div className="star-cluster">
                                <div className="icon--twinkle star-a"></div>
                                <div className="icon--twinkle delay-twinkle star-b"></div>
                                <div className="icon--twinkle star-c"></div>
                                <div className="icon--twinkle  star-d"></div>
                                <div className="icon--twinkle delay-twinkle star-e"></div>
                            </div>
                        </div>
                        <div className="map-score-characters">
                            {mapInfo.characters.map(char => (
                                <CharacterScore key={char.characterName} charName={char.characterName} charPicUrl={char.characterImg} />
                            ))}
                        </div>
                        <div className="map-total-score"><span>It took you <span className='map-sec-span'>56s</span> to found all characters</span></div>

                        <input type="text" className='map-user' placeholder='Username...' required/>
                        <div className="map-buttons">
                            <button type='button' className='map-button button-retry'>Retry Map</button>
                            <button className='map-button button-save-score'>Save Score</button>
                        </div>

                    </form>
                </div>
            }

        </main>
    )
}

export default Map