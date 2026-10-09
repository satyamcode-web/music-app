// ===============================
// SONG DATA (Path with ../)
// ===============================

const songs = [
    {
        id: 1,
        name: "satyam",
        artist: "the Weeknd",
        img: "image/images (1).jpeg",
        genre: "pop",
        source: "song/videoplayback (1).m4a"
    },
    {
        id: 2,
        name: "Anurag",
        artist: "the Weeknd",
        img: "image/images (2).jpeg",
        genre: "rock",
        source: "song/videoplayback (2).m4a"
    },
    {
        id: 3,
        name: "shivam",
        artist: "the Weeknd",
        img: "image/images (3).jpeg",
        genre: "hip-hop",
        source: "song/videoplayback(3).m4a"
    },
    {
        id: 4,
        name: "kartik",
        artist: "the Weeknd",
        img: "image/images (4).jpeg",
        genre: "pop",
        source: "song/videoplayback (1).m4a"
    },
    {
        id: 5,
        name: "krish",
        artist: "Dave Brubeck",
        img: "image/images (2).jpeg",
        genre: "jazz",
        source: "song/videoplayback (2).m4a"
    }
];


// ===============================
// VARIABLES
// ===============================

let currentIndex = 0;
let selectedPlaylist = null;
const playlists = {};


// ===============================
// HTML ELEMENTS
// ===============================

const songList = document.getElementById("songs-list");
const genreSelect = document.getElementById("genre");

const songImage = document.getElementById("song-image");
const songName = document.getElementById("song-name");
const artistName = document.getElementById("artist-name");

const audioPlayer = document.getElementById("audio-player");

const playBtn = document.getElementById("play-btn");
const previousBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");

const addPlaylistBtn = document.getElementById("add-playlist-btn");
const playlistInput = document.getElementById("playlist-input");
const createPlaylistBtn = document.getElementById("create-playlist-btn");

const playlistsContainer = document.getElementById("playlists");
const playlistSongsContainer = document.getElementById("playlist-songs");
const themeBtn = document.getElementById("theme-btn");


// ===============================
// GET FILTERED SONGS
// ===============================

function getFilteredSongs() {
    const selectedGenre = genreSelect ? genreSelect.value : "all";

    if (selectedGenre === "all") {
        return songs;
    }

    return songs.filter(function(song) {
        return song.genre === selectedGenre;
    });
}


// ===============================
// SHOW SONGS LIST
// ===============================

function showSongs(songArray) {
    if (!songList) return;
    
    songList.innerHTML = "";

    songArray.forEach(function(song) {
        const songElement = document.createElement("p");
        songElement.classList.add("song-item");
        songElement.textContent = song.name + " - " + song.artist;

        // Active song highlight check
        if (songs[currentIndex] && song.id === songs[currentIndex].id) {
            songElement.classList.add("active");
        }

        // Song Click Event
        songElement.addEventListener("click", function() {
            currentIndex = songs.findIndex(function(item) {
                return item.id === song.id;
            });

            renderCurrentSong();
            if (audioPlayer) audioPlayer.play();
        });

        songList.appendChild(songElement);
    });
}


// ===============================
// RENDER CURRENT SONG
// ===============================

function renderCurrentSong() {
    const currentSong = songs[currentIndex];
    if (!currentSong) return;

    if (songImage) songImage.src = currentSong.img;
    if (songName) songName.textContent = currentSong.name;
    if (artistName) artistName.textContent = currentSong.artist;
    if (audioPlayer) audioPlayer.src = currentSong.source;

    // Refresh song list highlight without breaking loop
    showSongs(getFilteredSongs());
}


// ===============================
// GENRE FILTER EVENT
// ===============================

if (genreSelect) {
    genreSelect.addEventListener("change", function() {
        showSongs(getFilteredSongs());
    });
}


// ===============================
// PLAY / PAUSE CONTROLS
// ===============================

if (playBtn && audioPlayer) {
    playBtn.addEventListener("click", function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });

    audioPlayer.addEventListener("play", function() {
        playBtn.textContent = "Pause";
    });

    audioPlayer.addEventListener("pause", function() {
        playBtn.textContent = "Play";
    });
}


// ===============================
// NEXT / PREVIOUS / ENDED
// ===============================

if (nextBtn) {
    nextBtn.addEventListener("click", function() {
        currentIndex++;
        if (currentIndex >= songs.length) {
            currentIndex = 0;
        }
        renderCurrentSong();
        if (audioPlayer) audioPlayer.play();
    });
}

if (previousBtn) {
    previousBtn.addEventListener("click", function() {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = songs.length - 1;
        }
        renderCurrentSong();
        if (audioPlayer) audioPlayer.play();
    });
}

if (audioPlayer) {
    audioPlayer.addEventListener("ended", function() {
        currentIndex++;
        if (currentIndex >= songs.length) {
            currentIndex = 0;
        }
        renderCurrentSong();
        audioPlayer.play();
    });
}


// ===============================
// CREATE PLAYLIST
// ===============================

if (createPlaylistBtn) {
    createPlaylistBtn.addEventListener("click", function() {
        const playlistName = playlistInput ? playlistInput.value.trim() : "";

        if (playlistName === "") {
            alert("Please enter playlist name.");
            return;
        }

        if (playlists[playlistName]) {
            alert("Playlist already exists.");
            return;
        }

        playlists[playlistName] = [];
        selectedPlaylist = playlistName;

        if (playlistInput) playlistInput.value = "";

        renderPlaylists();
        renderPlaylistSongs();
    });
}


// ===============================
// RENDER PLAYLISTS
// ===============================

function renderPlaylists() {
    if (!playlistsContainer) return;

    playlistsContainer.innerHTML = "";

    Object.keys(playlists).forEach(function(playlistName) {
        const playlistElement = document.createElement("p");
        playlistElement.classList.add("playlist-item");
        playlistElement.textContent = playlistName;

        if (playlistName === selectedPlaylist) {
            playlistElement.classList.add("selected");
        }

        playlistElement.addEventListener("click", function() {
            selectedPlaylist = playlistName;
            renderPlaylists();
            renderPlaylistSongs();
        });

        playlistsContainer.appendChild(playlistElement);
    });
}


// ===============================
// ADD SONG TO PLAYLIST
// ===============================

if (addPlaylistBtn) {
    addPlaylistBtn.addEventListener("click", function() {
        if (selectedPlaylist === null) {
            alert("Please create or select a playlist first.");
            return;
        }

        const currentSong = songs[currentIndex];
        const playlist = playlists[selectedPlaylist];

        const alreadyAdded = playlist.some(function(song) {
            return song.id === currentSong.id;
        });

        if (alreadyAdded) {
            alert("Song already added to this playlist.");
            return;
        }

        playlist.push(currentSong);
        renderPlaylistSongs();
    });
}


// ===============================
// RENDER PLAYLIST SONGS
// ===============================

function renderPlaylistSongs() {
    if (!playlistSongsContainer) return;

    playlistSongsContainer.innerHTML = "";

    if (selectedPlaylist === null) {
        playlistSongsContainer.textContent = "Select a playlist.";
        return;
    }

    const playlist = playlists[selectedPlaylist];

    if (playlist.length === 0) {
        playlistSongsContainer.textContent = "No songs in this playlist.";
        return;
    }

    playlist.forEach(function(song) {
        const songElement = document.createElement("p");
        songElement.classList.add("playlist-song");
        songElement.textContent = song.name + " - " + song.artist;

        songElement.addEventListener("click", function() {
            currentIndex = songs.findIndex(function(item) {
                return item.id === song.id;
            });

            renderCurrentSong();
            if (audioPlayer) audioPlayer.play();
        });

        playlistSongsContainer.appendChild(songElement);
    });
}


// ===============================
// THEME TOGGLE
// ===============================

if (themeBtn) {
    themeBtn.addEventListener("click", function() {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            themeBtn.textContent = "☀️ Light";
        } else {
            themeBtn.textContent = "🌙 Theme";
        }
    });
}


// ===============================
// INITIAL LOAD
// ===============================

showSongs(songs);
renderCurrentSong();
renderPlaylists();
renderPlaylistSongs();