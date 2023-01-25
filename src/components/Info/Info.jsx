import '../../assets/css/Info.css'

function Info() {
    return (
        <main className="info-section">
            <h1>Welcome to the Where's Waldo? app</h1>
            <p>Built using React, this web app allows you to play the classic game of finding Waldo and his friends in a variety of scenes. We used react-router for navigation and Firebase as our backend-as-a-service (BaaS) platform to store and retrieve data.</p>
            <h2>How to play</h2>
            <ol>
                <li>Click on the image to load the game.</li>
                <li>A menu will appear displaying the characters you need to find.</li>
                <li>Find the characters on the image.</li>
                <li>Click on the image of the character in the menu to mark them as found.</li>
                <li>Hover over the map name to see a list of all the characters you need to find in that scene.</li>
            </ol>
            <p> Happy hunting! Can you find all the characters?</p>
            <h2>Features</h2>
            <ul>
                <li>Multiple maps and scenes to choose from</li>
                <li>Mark characters as found and keep track of your progress</li>
                <li>Hover over map name for a list of characters to find</li>
                <li>Data is stored and retrieved using Firebase, ensuring your progress is saved</li>
                <li>Navigate between different maps and scenes using react-router</li>
            </ul>
            <p>We hope you have fun playing this game and enjoy the features we have added using React and Firebase!</p>
        </main>
    )
}

export default Info