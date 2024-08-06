let currentlyPlayingAudio = null;

// Base URL for audio files
const audioBaseURL = 'https://raw.githubusercontent.com/siondawson/serenade-strings/main/assets/audio/';

document.addEventListener('DOMContentLoaded', () => {
    // Get references to the list elements
    const rockPopList = document.getElementById('rock-pop-list');
    const classicalList = document.getElementById('classical-list');
    const filmList = document.getElementById('film-list');
    const jazzList = document.getElementById('jazz-list');
    const traditionalList = document.getElementById('traditional-list');
    const tangoList = document.getElementById('tango-list');

    // Function to fetch and populate lists
    function fetchAndPopulate(url, listElement) {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            for (const artist in data) {
                if (data.hasOwnProperty(artist)) {
                    const items = data[artist].songs;
                    items.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${artist} - ${item.title}`;
                        
                        if (item.mp3_file) {
                            const audioUrl = `${audioBaseURL}${item.mp3_file}`;
                            listItem.innerHTML += ` <i class="fas fa-volume-low" data-src="${audioUrl}"></i>`;
                            listItem.querySelector('i').addEventListener('click', () => toggleAudio(listItem, audioUrl));
                        }
                        
                        listElement.appendChild(listItem);
                    });
                }
            }
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    // Fetch and populate each category
    fetchAndPopulate('https://raw.githubusercontent.com/siondawson/serenade-strings/main/assets/json/pop-rock-rep.json', rockPopList);
    fetchAndPopulate('https://raw.githubusercontent.com/siondawson/serenade-strings/main/assets/json/classical-rep.json', classicalList);
    fetchAndPopulate('https://raw.githubusercontent.com/siondawson/serenade-strings/main/assets/json/film-musical-games-rep.json', filmList);
    fetchAndPopulate('https://raw.githubusercontent.com/siondawson/serenade-strings/main/assets/json/jazz-rep.json', jazzList);
    fetchAndPopulate('https://raw.githubusercontent.com/siondawson/serenade-strings/main/assets/json/traditional-rep.json', traditionalList);
    fetchAndPopulate('https://raw.githubusercontent.com/siondawson/serenade-strings/main/assets/json/tango-rep.json', tangoList);

    function toggleAudio(listItem, audioUrl) {
        const icon = listItem.querySelector('i');
        
        // Check if there is currently playing audio
        if (currentlyPlayingAudio && currentlyPlayingAudio.audio) {
            // Pause the currently playing audio
            currentlyPlayingAudio.audio.pause();
            currentlyPlayingAudio.audio.currentTime = 0;  // Reset time to start
            // Reset the class of the previous icon
            const previousIcon = currentlyPlayingAudio.listItem.querySelector('i');
            previousIcon.classList.remove('text-danger', 'fa-volume-up');
        }
        
        // Check if the user clicked the same icon again
        if (currentlyPlayingAudio && currentlyPlayingAudio.audio && currentlyPlayingAudio.audio.src === audioUrl) {
            // If yes, set currentlyPlayingAudio to null
            currentlyPlayingAudio = null;
        } else {
            // Create a new Audio instance and play the selected audio
            const audio = new Audio(audioUrl);
            audio.play()
                .then(() => {
                    currentlyPlayingAudio = {
                        audio: audio,
                        listItem: listItem
                    };
                    // Add the classes to the new icon
                    icon.classList.add('fa-volume-up', 'text-danger');
                })
                .catch(error => console.error('Error playing audio:', error));
        }
    }
});
