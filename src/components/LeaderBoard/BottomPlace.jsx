function BottomPlace(props) {
    const { place, userName, timeOffset } = props
    const chars = Object.keys(props).filter(key => {
        if (key === 'userName' || key === 'timeOffset' || key === 'startTimestamp' || key === 'endTimeStamp' || key == 'place') return false
        return true
    })

    const getTime = (char) => {
        return ((props[char] - props.startTimestamp) / 1000).toFixed(2)
    }
    chars.sort((a, b) => props[a] - props[b])
    return (
        <div className="bottom-place">
            <span className="bottom-place-rank">{place}</span>
            <div className="bottom-place-name">{userName}</div>
            <div className="char-times">
                {chars.map(key => (
                    <span key={key + place} className="bottom-place-char-time">{key} <span>{getTime(key)}s</span></span>
                ))}
            </div>
            <div className="bottom-place-time">{`${(timeOffset / 1000).toFixed(2)}s`}</div>
        </div>
    )
}
export default BottomPlace