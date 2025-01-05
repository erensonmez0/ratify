/**
 * RATIFY APP MAIN SCRIPT
 * Handles album recommendations, reviews, local storage, and search functionality.
 * Author: Eren Sönmez
 */

// Predefined top 100 albums (fetched from Apple Music) for the "Surprise Me" feature
const albumNames = [
    "Thriller",
    "The Dark Side of the Moon",
    "Rumours",
    "Abbey Road",
    "Back in Black",
    "Songs in the Key of Life",
    "good Kid, M.A.A.D City",
    "The Miseducation of Lauryn Hill",
    "Purple Rain (Deluxe Expanded Edition)",
    "Blonde",
    "Back to Black",
    "Nevermind",
    "Lemonade",
    "OK Computer",
    "Highway 61 Revisited",
    "21 Adele",
    "Blue Joni Mitchell",
    "What's Going On",
    "The Chronic",
    "Absolution",
    "Origin of Symmetry",
    "The Chronic Dr. Dre",
    "Pet Sounds",
    "Revolver",
    "Born to Run",
    "Discovery",
    "Ziggy Stardust",
    "Kind of Blue",
    "My Beautiful dark twisted fantasy",
    "Led Zeppelin II",
    "The Low End Theory",
    "When we fall asleep, where do we go?",
    "Jagged Little Pill",
    "Ready to Die",
    "Kid A",
    "It Takes a Nation of Millions to Hold Us Back",
    "London Calling",
    "Enter the Wu-Tang (36 Chambers)",
    "Tapestry",
    "Illmatic",
    "I never Loved a Man the Way I Loved You",
    "Aquemini",
    "Control Janet Jackson",
    "Remain in Light",
    "Innervisions Stevie Wonder",
    "Homogenic Björk",
    "Exodus Bob Marley",
    "Drake Take Care",
    "Paul's Boutique",
    "The Joshua Tree U2",
    "Hounds of Love Kate Bush",
    "Sign O' the Times Prince",
    "Appetite for Destruction",
    "Exile on Main St.",
    "A Love Supreme John Coltrane",
    "ANTI Rihanna",
    "Disintegration The Cure",
    "Voodoo D'Angelo",
    "(What's the Story) Morning Glory",
    "AM",
    "The Velvet Underground & Nico",
    "Love Deluxe Sade",
    "All Eyez on Me",
    "Are you Experienced",
    "Baduizm",
    "3 Feet High and Rising",
    "The Queen is Dead",
    "Dummy Portishead",
    "Is this It the Strokes",
    "Master of Puppets",
    "Straight Outta Compton",
    "Trans-Europe Express",
    "SOS SZA",
    "Aja Steely Dan",
    "The Downward Spiral",
    "Supa Dupa Fly Missy Elliott",
    "Like A Prayer Madonna",
    "Goodbye Yellow Brick Road",
    "Norman F*****g Rockwell!",
    "The Marshall Mathers LP",
    "After the Gold Rush",
    "Get Rich or Die Tryin'",
    "Horses Patti Smith",
    "My Life Mary J. Blige",
    "Blue Lines",
    "I put a Spell on You",
    "The Fame Monster",
    "Listen Without Prejudice, Vol. 1",
    "Flower Boy",
    "Pure Heroine",
    "Rage Against the Machine",
    "ASTROWORLD",
    "Hotel California the Eagles",
];

// Local storage key names
const SAVED_ALBUMS_KEY = "savedAlbums";
const ALBUM_LIBRARY_KEY = "albumLibrary";

/**
 * Initializes event listeners and detects device type (mobile or desktop).
 * Handles interactions such as rating stars, detecting device motion, and managing the "Surprise Me" feature.
 */
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    const surpriseMeButton = document.getElementById("surpriseMeButton");
    const instruction = document.getElementById("instruction");

    if (!instruction) console.error("Instruction element not found.");
    if (!surpriseMeButton) console.error("Surprise Me button not found.");

    const stars = document.querySelectorAll(".rating-container .star");

    stars.forEach((star, index) => {
        star.addEventListener("mouseenter", () => {
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.classList.add("hover");
                } else {
                    s.classList.remove("hover");
                }
            });
        });

        star.addEventListener("mouseleave", () => {
            stars.forEach((s) => s.classList.remove("hover"));
        });

        star.addEventListener("click", () => {
            stars.forEach((s, i) => {
                s.classList.toggle("active", i <= index);
            });
        });
    });

    const isMobile = /iPhone|iPad|iPod|Android|Macintosh/i.test(navigator.userAgent);
    console.log("Is Mobile Device:", isMobile);

    let albumRecommended = false;

    // Handles "Surprise Me" feature based on device motion for mobile devices.
    if (isMobile && typeof DeviceMotionEvent !== "undefined") {
        console.log("DeviceMotionEvent supported.");
        instruction.textContent = "Tap the button to allow access, then shake your device!";
        surpriseMeButton.style.display = "inline-block"; // Show the button for permission

        surpriseMeButton.addEventListener("click", () => {
            if (typeof DeviceMotionEvent.requestPermission === "function") {
                DeviceMotionEvent.requestPermission()
                    .then((response) => {
                        if (response === "granted") {
                            console.log("Motion permission granted!");
                            enableShakeDetection();
                            instruction.textContent = "Now shake your device to discover a new album!";
                            surpriseMeButton.style.display = "none"; // Hide the button after permission
                        } else {
                            console.error("Motion permission denied.");
                            instruction.textContent =
                                "Motion permission denied. Tap again to retry or use the button.";
                        }
                    })
                    .catch((error) => {
                        console.error("Error requesting motion permission:", error);
                        instruction.textContent =
                            "Error requesting motion access. Tap the button to retry.";
                    });
            } else {
                console.log("DeviceMotionEvent doesn't require permission.");
                enableShakeDetection();
                instruction.textContent = "Now shake your device to discover a new album!";
            }
        });
    } else {
        console.log("DeviceMotionEvent not supported on this device.");
        instruction.textContent = "Tap the button to discover a new album.";
        surpriseMeButton.style.display = "inline-block";
        surpriseMeButton.addEventListener("click", surpriseMe);
    }

    /**
     * Enables shake detection for mobile devices to trigger album recommendations.
     */
    function enableShakeDetection() {
        console.log("Shake detection enabled.");
        let lastShakeTime = 0;

        window.addEventListener("devicemotion", (event) => {
            if (albumRecommended) {
                console.log("Album already recommended. Shake ignored.");
                return; // Stop further recommendations
            }

            const acceleration = event.acceleration;
            if (
                acceleration &&
                acceleration.x !== null &&
                acceleration.y !== null &&
                acceleration.z !== null
            ) {
                const totalAcceleration =
                    Math.abs(acceleration.x) +
                    Math.abs(acceleration.y) +
                    Math.abs(acceleration.z);

                console.log("Total Acceleration:", totalAcceleration);

                if (totalAcceleration > 20) { // Shake threshold
                    const now = Date.now();
                    if (now - lastShakeTime > 1000) { // 1-second debounce
                        lastShakeTime = now;
                        console.log("Shake detected!");

                        // Trigger recommendation only once
                        if (!albumRecommended) {
                            albumRecommended = true; // Set the flag to true
                            surpriseMe(); // Show the recommendation
                        }
                    }
                }
            } else {
                console.warn("Incomplete acceleration data:", acceleration);
            }
        });
    }

    /**
     * Recommends a random album from a predefined list and displays it.
     * Fetches album details and displays them in the "Recommendation" container.
     * @returns {Object|null} The recommended album details or null if no recommendation is found.
     */
    async function surpriseMe() {
        console.log("Surprise Me triggered.");
        
        const surpriseMeButton = document.getElementById("surpriseMeButton");
        if (surpriseMeButton) {
            surpriseMeButton.style.display = "none";
        }
    
        const randomAlbumName = albumNames[Math.floor(Math.random() * albumNames.length)];
        console.log("Random Album:", randomAlbumName);
    
        const albumDetails = await fetchAlbumDetails(randomAlbumName);
    
        const recommendationContainer = document.getElementById("recommendation");
        if (!recommendationContainer) {
            console.error("Recommendation container not found.");
            return;
        }
    
        if (albumDetails) {
            recommendationContainer.innerHTML = `
                <div class="album-recommendation fade-in">
                    <img src="${albumDetails.cover}" alt="${albumDetails.name}" />
                    <h3>${albumDetails.name}</h3>
                    <p>by ${albumDetails.artist}</p>
                    <p>Release Date: ${new Date(albumDetails.releaseDate).toLocaleDateString()}</p>
                    <button id="addToListButton">Add to My List</button>
                </div>
            `;
    
            const albumElement = document.querySelector(".album-recommendation");
            albumElement.classList.add("fade-in");
            setTimeout(() => albumElement.classList.remove("fade-in"), 1000);
    
            const addToListButton = document.getElementById("addToListButton");
            addToListButton.addEventListener("click", () => {
                addToMyList(albumDetails.name, albumDetails.artist, albumDetails.cover);
                showToast(`${albumDetails.name} by ${albumDetails.artist} has been added to your list!`);
            });
        } else {
            recommendationContainer.innerHTML = "<p>Sorry, no recommendation could be found at this time.</p>";
        }
    }    
    
});

/**
 * Initialises the menu for the mobile devices.
 */
document.addEventListener("DOMContentLoaded", () => {
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const nav = document.querySelector("nav");

    if (hamburgerMenu && nav) {
        // Toggle the menu on click
        hamburgerMenu.addEventListener("click", () => {
            nav.classList.toggle("open");
        });
    } else {
        console.error("Hamburger menu or navigation element not found.");
    }
});

const savedAlbums = JSON.parse(localStorage.getItem(SAVED_ALBUMS_KEY)) || [];
savedAlbums.forEach(album => {
    if (!album.dateAdded) {
        album.dateAdded = new Date().toISOString();
    }
});
localStorage.setItem(SAVED_ALBUMS_KEY, JSON.stringify(savedAlbums));

/**
 * Fetches an access token from Spotify's API.
 * @returns {Promise<string>} The access token for Spotify API requests.
 * @throws {Error} If the token cannot be retrieved.
 */
async function getAccessToken() {
    const clientId = '269e493e4c8142f6974ad609b988648d';
    const clientSecret = 'bacc49ad2afd4b2f883826e0aba08904';

    const credentials = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${credentials}`,
        },
        body: "grant_type=client_credentials",
    });

    const data = await response.json();

    if (data.access_token) {
        return data.access_token;
    } else {
        console.error("Error getting access token:", data);
        throw new Error("Could not get access token");
    }
}

/**
 * Searches for albums using the Spotify API.
 * @param {string} query - The search term entered by the user.
 * @returns {Promise<void>}
 */
async function searchAlbum(query) {
    const token = await getAccessToken();

    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${query}&type=album&limit=10`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (data.albums) {
        displaySearchResults(data.albums.items);
    } else {
        console.error("Error fetching albums:", data);
        alert("Failed to fetch albums. Please try again.");
    }
}

/**
 * Displays search results on the page.
 * @param {Array} albums - The list of albums returned from the Spotify API.
 */
function displaySearchResults(albums) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    const savedLibrary = JSON.parse(localStorage.getItem(ALBUM_LIBRARY_KEY)) || [];

    albums.forEach((album) => {
        const releaseDate = album.release_date ? `(${album.release_date.split('-')[0]})` : "";
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album");

        // Create album content
        albumDiv.innerHTML = `
            <img src="${album.images[0]?.url}" alt="${album.name}" />
            <p><strong>${album.name}</strong> by ${album.artists.map(artist => artist.name).join(", ")}</p>
            <button class="add-to-list">Add to My List</button>
            <button class="review-button">${savedLibrary.find(saved => saved.title === album.name) ? "Review Again" : "Review"}</button>
        `;

        // Attach event listeners
        const addToListButton = albumDiv.querySelector(".add-to-list");
        const reviewButton = albumDiv.querySelector(".review-button");

        addToListButton.addEventListener("click", () => {
            addToMyList(
                album.name,
                album.artists.map(artist => artist.name).join(", "),
                album.images[0]?.url
            );
        });

        reviewButton.addEventListener("click", () => {
            const reviewedAlbum = savedLibrary.find(saved => saved.title === album.name);
            openReviewPopup(
                album.name,
                album.images[0]?.url,
                album.release_date,
                reviewedAlbum ? reviewedAlbum.review : null,
                reviewedAlbum ? reviewedAlbum.rating : null
            );
        });

        resultsContainer.appendChild(albumDiv);
    });
}

/**
 * Adds an album to the user's saved list.
 * @param {string} albumName - The name of the album.
 * @param {string} artistName - The artist(s) of the album.
 * @param {string} albumCover - The URL of the album's cover image.
 */
function addToMyList(albumName, artistName, albumCover) {
    console.log("Adding album:", albumName, artistName, albumCover); // Debugging
    const savedAlbums = JSON.parse(localStorage.getItem(SAVED_ALBUMS_KEY)) || [];
    const albumExists = savedAlbums.some(album => album.albumName === albumName);

    if (!albumExists) {
        savedAlbums.push({ albumName, artistName, albumCover, dateAdded: new Date().toISOString() });
        localStorage.setItem(SAVED_ALBUMS_KEY, JSON.stringify(savedAlbums));
        showToast(`${albumName} by ${artistName} has been added to your list!`);
    } else {
        showToast(`${albumName} is already in your list!`);
    }
}

/**
 * Displays the saved albums on the page.
 */
function displaySavedAlbums() {
    const savedList = document.getElementById("savedList");
    const emptyListMessage = document.getElementById("emptyListMessage");
    const savedAlbums = JSON.parse(localStorage.getItem(SAVED_ALBUMS_KEY)) || [];

    savedList.innerHTML = "";

    if (savedAlbums.length === 0) {
        emptyListMessage.style.display = "flex";
        return;
    } else {
        emptyListMessage.style.display = "none";
    }

    // Create a sorted copy for display purposes
    const sortedAlbums = [...savedAlbums].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    sortedAlbums.forEach((album) => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album-item");

        albumDiv.innerHTML = `
            <img src="${album.albumCover}" alt="${album.albumName}" class="album-cover" />
            <div class="album-details">
                <h3>${album.albumName}</h3>
                <p>by ${album.artistName}</p>
                <p>Date Added: ${new Date(album.dateAdded).toLocaleDateString()}</p>
            </div>
        `;

        // Add click event to open the delete confirmation modal
        albumDiv.addEventListener("click", () => {
            openAlbumOptions(savedAlbums.indexOf(album));
        });

        savedList.appendChild(albumDiv);
    });
}

document.addEventListener("DOMContentLoaded", displaySavedAlbums);

/**
 * Opens the album options modal and allows users to confirm or cancel album deletion.
 * @param {number} index - The index of the album to be deleted in the saved albums array.
 */
function openAlbumOptions(index) {
    const modal = document.getElementById("confirmationModal");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    modal.style.display = "flex";

    // Handle "Yes" button click
    confirmButton.onclick = () => {
        console.log("Deleting album at index:", index);
        removeAlbum(index);
        modal.style.display = "none";
        showToast("Album removed successfully!");
    };

    // Handle "No" button click
    cancelButton.onclick = () => {
        modal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

/**
 * Removes an album from the saved albums list and updates localStorage.
 * @param {number} index - The index of the album to be removed.
 */
function removeAlbum(index) {
    const savedAlbums = JSON.parse(localStorage.getItem(SAVED_ALBUMS_KEY)) || [];
    savedAlbums.splice(index, 1);

    localStorage.setItem(SAVED_ALBUMS_KEY, JSON.stringify(savedAlbums));
    displaySavedAlbums();
    showToast("Album removed successfully!");
}

let currentAlbum = null;

/**
 * Opens the review popup for a specific album, allowing users to rate and review the album.
 * @param {string} albumName - The name of the album to review.
 * @param {string} albumCover - The URL of the album's cover image.
 * @param {string} albumYear - The release year of the album.
 * @param {string|null} [previousReview=null] - The previous review for the album, if available.
 * @param {number|null} [previousRating=null] - The previous rating for the album, if available.
 */
function openReviewPopup(albumName, albumCover, albumYear, previousReview = null, previousRating = null) {
    currentAlbum = { title: albumName, cover: albumCover, year: albumYear };

    // Update popup content
    document.getElementById("albumCover").src = albumCover;
    document.getElementById("albumTitle").textContent = albumName;
    document.getElementById("albumYear").textContent = albumYear;

    document.getElementById("reviewText").value = previousReview || "";

    const stars = document.querySelectorAll(".rating-container .star");
    stars.forEach((star, index) => {
        star.classList.toggle("active", previousRating && index < previousRating);
    });

    currentAlbum.rating = previousRating || null;

    const popup = document.getElementById("reviewPopup");
    popup.style.display = "flex";
}

// Close the review popup when ESC is pressed
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { // Check if the ESC key was pressed
        closeReviewPopup();
    }
});

/**
 * Closes the review popup.
 */
function closeReviewPopup() {
    const popup = document.getElementById("reviewPopup");
    popup.style.display = "none";
}

/**
 * Sets the rating for the current album and updates the star UI.
 * @param {number} rating - The rating value (e.g., 1-5).
 */
function setRating(rating) {
    const stars = document.querySelectorAll(".rating-container .star");
    stars.forEach((star, index) => {
        star.classList.toggle("active", index < rating);
        star.dataset.rating = index + 1;
    });

    currentAlbum.rating = rating;
}

document.querySelectorAll(".rating-container .star").forEach((star, index) => {
    star.addEventListener("mouseenter", () => {
        document.querySelectorAll(".rating-container .star").forEach((s, i) => {
            s.classList.toggle("hover", i <= index);
        });
    });

    star.addEventListener("mouseleave", () => {
        document.querySelectorAll(".rating-container .star").forEach((s) => {
            s.classList.remove("hover");
        });
    });
});

/**
 * Saves a user's review and rating for the current album to localStorage.
 */
function saveReview() {
    const reviewText = document.getElementById("reviewText").value.trim();
    const rating = currentAlbum.rating;

    if (reviewText && rating) {
        const savedLibrary = JSON.parse(localStorage.getItem(ALBUM_LIBRARY_KEY)) || [];
        const existingIndex = savedLibrary.findIndex((album) => album.title === currentAlbum.title);

        if (existingIndex !== -1) {
            // Update the existing review
            savedLibrary[existingIndex] = {
                ...savedLibrary[existingIndex],
                rating,
                review: reviewText,
            };
        } else {
            // Add a new review
            savedLibrary.push({
                title: currentAlbum.title,
                cover: currentAlbum.cover,
                rating,
                review: reviewText,
            });
        }

        localStorage.setItem(ALBUM_LIBRARY_KEY, JSON.stringify(savedLibrary));
        showToast(`Your review for "${currentAlbum.title}" has been saved successfully!`);
        closeReviewPopup();
    } else {
        showFeedback("Please provide a rating and a review before saving.");
    }
}

/**
 * Displays a custom feedback popup with a message.
 * @param {string} message - The message to display in the popup.
 */
function showFeedback(message) {
    const feedbackPopup = document.getElementById("feedbackPopup");
    const feedbackMessage = document.getElementById("feedbackMessage");
    const closeFeedbackButton = document.getElementById("closeFeedbackButton");

    feedbackMessage.textContent = message;
    feedbackPopup.style.display = "flex";

    closeFeedbackButton.addEventListener("click", () => {
        feedbackPopup.style.display = "none";
    });

    // Optional: Close popup when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target === feedbackPopup) {
            feedbackPopup.style.display = "none";
        }
    });
}

/**
 * Loads the saved albums library and displays it in the UI.
 */
function loadAlbumLibrary() {
    const savedLibrary = JSON.parse(localStorage.getItem(ALBUM_LIBRARY_KEY)) || [];
    const libraryContainer = document.getElementById("libraryList");
    libraryContainer.innerHTML = "";

    savedLibrary.forEach((album, index) => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album-item");
        albumDiv.setAttribute("data-index", index);

        albumDiv.innerHTML = `
            <img src="${album.cover}" alt="${album.title}">
            <div class="album-details">
                <h3>${album.title}</h3>
                <p class="rating">
                    ${[...Array(5)].map((_, i) => `
                        <span class="star ${i < album.rating ? "active" : ""}">&#9733;</span>
                    `).join("")}
                </p>
                <p class="review">${album.review}</p>
            </div>
        `;

        // Add click event to show delete confirmation
        albumDiv.addEventListener("click", () => openDeletePopup(index));

        libraryContainer.appendChild(albumDiv);
    });
}

/**
 * Opens a delete confirmation popup for the selected album.
 * @param {number} index - The index of the album to delete.
 */
function openDeletePopup(index) {
    const popup = document.getElementById("deletePopup");
    const confirmDelete = document.getElementById("confirmDelete");

    popup.style.display = "flex";
    confirmDelete.onclick = () => deleteReview(index);

    document.getElementById("cancelDelete").onclick = () => {
        popup.style.display = "none";
    };

    document.getElementById("closeDeletePopup").onclick = () => {
        popup.style.display = "none";
    };
}

/**
 * Deletes a review from the saved albums library by index and updates the UI.
 * @param {number} index - The index of the album to delete.
 */
function deleteReview(index) {
    const savedLibrary = JSON.parse(localStorage.getItem(ALBUM_LIBRARY_KEY)) || [];

    savedLibrary.splice(index, 1);
    localStorage.setItem(ALBUM_LIBRARY_KEY, JSON.stringify(savedLibrary));

    loadAlbumLibrary();
    document.getElementById("deletePopup").style.display = "none";
}

// Ensure the library loads when the page is ready
document.addEventListener("DOMContentLoaded", loadAlbumLibrary);

/**
 * Handles the album search by validating user input.
 * Calls `searchAlbum` if the input is valid, or alerts the user otherwise.
 */
function handleSearch() {
    const query = document.getElementById("albumSearch").value.trim();
    if (query) {
        searchAlbum(query);
    } else {
        showCustomFeedback("Please enter a search term.");
    }
}

document.getElementById("searchButton").addEventListener("click", handleSearch);

document.getElementById("albumSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

/**
 * Displays a custom popup with a feedback message.
 * @param {string} message - The message to display in the popup.
 */
function showCustomFeedback(message) {
    const popup = document.getElementById("customFeedbackPopup");
    const messageElement = document.getElementById("customFeedbackMessage");
    const closeButton = document.getElementById("closePopupButton");

    // Set the message and display the popup
    messageElement.textContent = message;
    popup.style.display = "flex";

    // Close popup when clicking the button
    closeButton.onclick = () => {
        popup.style.display = "none";
    };

    // Optional: Close the popup when clicking outside of it
    window.onclick = (event) => {
        if (event.target === popup) {
            popup.style.display = "none";
        }
    };
}

/**
 * Displays a toast message for user feedback.
 * @param {string} message - The message to display in the toast.
 */
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/**
 * Fetches album details from Spotify API by album name.
 * @param {string} albumName The name of the album to search for.
 * @returns A promise that resolves to the album details object or null if not found.
 */
async function fetchAlbumDetails(albumName) {
    const token = await getAccessToken();

    try {
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album&limit=1`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (data.albums && data.albums.items.length > 0) {
            const album = data.albums.items[0];
            return {
                name: album.name,
                artist: album.artists[0].name,
                cover: album.images[0]?.url,
                releaseDate: album.release_date,
            };
        } else {
            console.error("No album found for:", albumName);
            return null;
        }
    } catch (error) {
        console.error("Error fetching album details:", error);
        return null;
    }
}

document.getElementById("surpriseMeButton").addEventListener("click", surpriseMe);