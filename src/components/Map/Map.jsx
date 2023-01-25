import '../../assets/css/Map.css'
import Maps from '../../assets/Maps'
import HoverMenuItem from './HoverMenu'
import { useState, useRef, useEffect, useCallback } from "react"
import { useParams, Link, useNavigate } from 'react-router-dom'
import { doc, getFirestore, setDoc, getDoc, deleteDoc, collection, where, query, limit, getDocs, orderBy, updateDoc } from 'firebase/firestore'
import CharacterScore from './CharacterScore'

function Map(props) {
    const navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [place, setPlace] = useState()
    const [timer, setTimer] = useState()
    const [firstTime] = useState(new Date().getTime())
    const [charTimes, setCharTimes] = useState({})
    const [mapInfo, setMap] = useState({})
    const [animated, setAnimate] = useState(false)
    const url = useParams()
    const hoverRef = useRef()
    const waveRef = useRef()
    const [menuItems, setMenuItems] = useState(0)
    const [positionX, setPositionX] = useState()
    const [positionY, setPositionY] = useState()

    const restartAnimation = useCallback(() => {
        setAnimate(true)
    }, [])

    const handleClick = useCallback((e) => {
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
    }, [restartAnimation])



    const handleAnimation = useCallback((e) => {
        setAnimate(false)
    }, [])

    const setItemFounded = useCallback(() => {
        setMenuItems(prevState => prevState + 1)
    }, [])

    const getUniqueId = useCallback(async () => {

        let rndNum = Math.random() * 10
        try {
            let attempt = await getDoc(doc(getFirestore(), `leaderboard=${url.level}`, rndNum.toString()))
            if (!attempt.data()) {
                await updateDoc(doc(getFirestore(), `leaderboard-${url.level}`, rndNum.toString()), {
                    startTimestamp: firstTime,
                    userName: 'Anonymous'
                }).catch(() => {
                    setDoc(doc(getFirestore(), `leaderboard-${url.level}`, rndNum.toString()), {
                        startTimestamp: firstTime
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

    }, [firstTime, props, url.level])

    const calcTime = useCallback(async () => {
        try {
            let times = await getDoc(doc(getFirestore(), `leaderboard-${url.level}`, props.uniqueId.toString()))
            await updateDoc(doc(getFirestore(), `leaderboard-${url.level}`, props.uniqueId.toString()), {
                timeOffset: times.data().endTimeStamp - times.data().startTimestamp
            })
            return times.data().endTimestamp - times.data().startTimestamp
        } catch (error) {
            console.error('Error calculating time', error)
        }

    }, [props.uniqueId, url.level])

    const getPlace = useCallback(async (offset) => {
        let matchData = await getDoc(doc(getFirestore(), `leaderboard-${url.level}`, props.uniqueId.toString()))
        setCharTimes(matchData.data())
        let leaderboard = query(collection(getFirestore(), `leaderboard-${url.level}`), where('timeOffset', '>', 0), orderBy('timeOffset'), limit(100))
        let docs = await getDocs(leaderboard)
        let count = 1
        docs.forEach((doc) => {
            if (doc.id == props.uniqueId) {
                setPlace(count)
            }
            count++
        })
        setPlace(prevState => prevState ? prevState : 0)
    }, [props.uniqueId, url.level])

    const updateTimer = useCallback(() => {
        if (charTimes.timeOffset) {
            setTimer(new Date(charTimes.timeOffset))
            return
        }
        let currentTime = new Date().getTime()
        setTimer(new Date(currentTime - firstTime))
    }, [firstTime, charTimes])

    const handleRetryClick = () => {
        props.setKeyId(prevState => prevState + 1)
    }

    const handleInput = (e) => {
        setUserName(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        await updateDoc(doc(getFirestore(), `leaderboard-${url.level}`, props.uniqueId.toString()), {
            userName
        })
        navigate(`/leaderboard/${url.level}`)
    }

    useEffect(() => {
        let inter = setInterval(updateTimer, 100)
        let removeHover = () => {
            hoverRef.current.style.display = 'none'
            waveRef.current.style.display = 'none'
        }
        window.addEventListener('scroll', removeHover)
        setMap(Maps[url.level - 1])
        getUniqueId()

        return () => {
            clearInterval(inter)
            window.removeEventListener('scroll', removeHover)
            document.body.classList.remove('body-fixed')
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
            document.body.classList.add('body-fixed')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuItems])
    return (
        <>
            
            <span className="map-info-container">
                <div className="map-name">{mapInfo.mapName}</div>
                <div className="floating-chars">
                    {mapInfo.characters && mapInfo.characters.map(char => (
                        <span className="float-img-container">
                            <img src={char.characterImg} alt="Floating character" className='map-floating-char' />
                        </span>
                    ))}
                </div>
            </span>
            {timer && <span className='map-timer'><span className="map-sub-timer">{timer.toISOString().slice(12, 22)}</span> <svg className='clock-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>clock-fast</title><path fill='purple' d="M15,4A8,8 0 0,1 23,12A8,8 0 0,1 15,20A8,8 0 0,1 7,12A8,8 0 0,1 15,4M15,6A6,6 0 0,0 9,12A6,6 0 0,0 15,18A6,6 0 0,0 21,12A6,6 0 0,0 15,6M14,8H15.5V11.78L17.83,14.11L16.77,15.17L14,12.4V8M2,18A1,1 0 0,1 1,17A1,1 0 0,1 2,16H5.83C6.14,16.71 6.54,17.38 7,18H2M3,13A1,1 0 0,1 2,12A1,1 0 0,1 3,11H5.05L5,12L5.05,13H3M4,8A1,1 0 0,1 3,7A1,1 0 0,1 4,6H7C6.54,6.62 6.14,7.29 5.83,8H4Z" /></svg></span>}
            <main>
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
            </main>
            {menuItems >= 3
                && <div className='map-endgame-modal'>
                    {place === 0
                        ? <div className="map-retry-game">
                            <h2>Great Game!</h2>
                            <span >Keep grinding! Even though you didn't make it to the top 100 this time, don't let that discourage you. Keep pushing and you'll reach your goals."</span>
                            <div className="map-score-characters">
                                {mapInfo.characters.map(char => (
                                    <CharacterScore key={char.characterName} charName={char.characterName} charPicUrl={char.characterImg} statTime={charTimes.startTimestamp} charTime={charTimes[char.characterName]} />
                                ))}
                            </div>
                            <div className="map-total-score-retry"><span>It took you <span className='map-sec-span'>{((charTimes.endTimeStamp - charTimes.startTimestamp) / 1000).toFixed(2)}s </span> to found all characters</span></div>
                            <div className="map-buttons">
                                <button type='button' className='map-button-retry button-retry-retry' onClick={handleRetryClick}>Retry Map</button>
                                <Link to='/' className='map-button-retry main-menu-button-retry'>Main Menu</Link>
                            </div>
                        </div>
                        : <form action="" className="map-bestscore-form" onSubmit={handleSubmit}>
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
                                    <CharacterScore key={char.characterName} charName={char.characterName} charPicUrl={char.characterImg} statTime={charTimes.startTimestamp} charTime={charTimes[char.characterName]} />
                                ))}
                            </div>
                            <div className="map-total-score"><span>It took you <span className='map-sec-span'>{((charTimes.endTimeStamp - charTimes.startTimestamp) / 1000).toFixed(2)}s </span> to found all characters</span></div>

                            <input type="text" className='map-user' value={userName} placeholder='Username for Score...' required onChange={handleInput} />
                            <div className="map-buttons">
                                <button type='button' className='map-button button-retry' onClick={handleRetryClick}>Retry Map</button>
                                <button className='map-button button-save-score'>Save Score</button>
                                <Link to='/' className='map-button main-menu-button'>Main Menu</Link>
                            </div>

                        </form>}
                </div>
            }
        </>
    )
}

export default Map