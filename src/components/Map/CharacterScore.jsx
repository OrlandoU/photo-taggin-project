function CharacterScore({charName, charPicUrl, statTime, charTime}){

    const getSeconds = () => {
        return ((charTime - statTime) / 1000).toFixed(2)
    }

    return (
        <span className="map-char-score">
            <div className="map-image-container">
                <img src={charPicUrl} alt="Character Pic" className='map-score-char-img' />
            </div>
            <div className="flex">
                <p className="map-score-name">{charName}</p>
                <p className="map-score-time">{getSeconds()}s</p>
            </div>
        </span>
    )
}

export default CharacterScore