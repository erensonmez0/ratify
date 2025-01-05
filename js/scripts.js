//The Predefined top 100 Albums of all time for the "Surprise Me" feature.
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

const editPopup = document.getElementById("editPopup");
const closeEditPopupButton = document.getElementById("closeEditPopup");
const saveEditButton = document.getElementById("saveEditButton");
const deleteReviewButton = document.getElementById("deleteReviewButton");

console.log("Save Edit Button:", saveEditButton); // Debugging
console.log("Delete Review Button:", deleteReviewButton); // Debugging

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Define and initialize variables
    const editPopup = document.getElementById("editPopup");
    const closeEditPopupButton = document.getElementById("closeEditPopup");
    const saveEditButton = document.getElementById("saveEditButton");
    const deleteReviewButton = document.getElementById("deleteReviewButton");
    const surpriseMeButton = document.getElementById("surpriseMeButton");
    const instruction = document.getElementById("instruction");
    const searchButton = document.getElementById("searchButton");
    const albumSearch = document.getElementById("albumSearch");

    // Check for necessary elements and attach event listeners
    if (saveEditButton) {
        saveEditButton.addEventListener("click", () => {
            console.log("Save Changes button clicked");
            saveChanges();
        });
    } else {
        console.error("Save Edit Button not found!");
    }

    if (deleteReviewButton) {
        deleteReviewButton.addEventListener("click", () => {
            console.log("Delete Review button clicked");
            deleteReview();
        });
    } else {
        console.error("Delete Review Button not found!");
    }

    if (closeEditPopupButton) {
        closeEditPopupButton.addEventListener("click", closeEditPopup);
    } else {
        console.error("Close Edit Popup button not found!");
    }

    if (surpriseMeButton && instruction) {
        setupSurpriseMeButton(surpriseMeButton, instruction);
    } else {
        if (!instruction) console.error("Instruction element not found.");
        if (!surpriseMeButton) console.error("Surprise Me button not found.");
    }

    if (searchButton && albumSearch) {
        searchButton.addEventListener("click", handleSearch);
        albumSearch.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                handleSearch();
            }
        });
    } else {
        console.error("Search elements not found!");
    }

    // Initialize the album library
    loadAlbumLibrary();

    // Add star rating listeners
    const stars = document.querySelectorAll(".rating-container .star");
    stars.forEach((star, index) => {
        star.addEventListener("mouseenter", () => highlightStars(stars, index));
        star.addEventListener("mouseleave", () => clearStarHighlights(stars));
        star.addEventListener("click", () => setRating(index + 1));
    });

    console.log("All event listeners have been set.");
});

    // Function to highlight stars on hover
    function highlightStars(stars, index) {
        stars.forEach((s, i) => {
            s.classList.toggle("hover", i <= index);
        });
    }

    // Function to clear star highlights
    function clearStarHighlights(stars) {
        stars.forEach((s) => s.classList.remove("hover"));
    }

    // Function to set the current rating
    function setRating(rating) {
        const stars = document.querySelectorAll(".rating-container .star");
        stars.forEach((star, index) => {
            star.classList.toggle("active", index < rating);
        });
        if (currentAlbum) currentAlbum.rating = rating;
    }

    // Function to close the edit popup
    function closeEditPopup() {
        const popup = document.getElementById("editPopup");
        if (popup) {
            popup.style.display = "none";
        } else {
            console.error("Edit Popup element not found!");
        }
    }

    // Function to save changes (modify as per your logic)
    function saveChanges() {
        const updatedReview = document.getElementById("editReviewText").value.trim();
        const updatedRating = currentAlbum.rating;
    
        if (updatedReview && updatedRating) {
            const savedLibrary = JSON.parse(localStorage.getItem("albumLibrary")) || [];
            if (currentAlbum.index !== undefined) {
                savedLibrary[currentAlbum.index] = {
                    ...savedLibrary[currentAlbum.index],
                    review: updatedReview,
                    rating: updatedRating,
                };
                localStorage.setItem("albumLibrary", JSON.stringify(savedLibrary));
                loadAlbumLibrary();
                closeEditPopup();
                showToast(`Your review for "${currentAlbum.title}" has been updated.`);
            } else {
                console.error("No index found for currentAlbum.");
            }
        } else {
            alert("Please provide both a review and a rating.");
        }
    }

    // Function to delete review (modify as per your logic)
    function deleteReview() {
        const savedLibrary = JSON.parse(localStorage.getItem("albumLibrary")) || [];
        if (currentAlbum.index !== undefined) {
            savedLibrary.splice(currentAlbum.index, 1);
            localStorage.setItem("albumLibrary", JSON.stringify(savedLibrary));
            loadAlbumLibrary();
            closeEditPopup();
            showToast(`"${currentAlbum.title}" has been deleted.`);
        } else {
            console.error("No index found for currentAlbum.");
        }
    }

    // Function to set up the Surprise Me button
    function setupSurpriseMeButton(surpriseMeButton, instruction) {
        const isMobile = /iPhone|iPad|iPod|Android|Macintosh/i.test(navigator.userAgent);
        console.log("Is Mobile Device:", isMobile);

        if (isMobile && typeof DeviceMotionEvent !== "undefined") {
            console.log("DeviceMotionEvent supported.");
            instruction.textContent = "Tap the button to allow access, then shake your device!";
            surpriseMeButton.style.display = "inline-block";

            surpriseMeButton.addEventListener("click", () => {
                if (typeof DeviceMotionEvent.requestPermission === "function") {
                    DeviceMotionEvent.requestPermission()
                        .then((response) => {
                            if (response === "granted") {
                                console.log("Motion permission granted!");
                                enableShakeDetection();
                                instruction.textContent = "Now shake your device to discover a new album!";
                                surpriseMeButton.style.display = "none";
                            } else {
                                console.error("Motion permission denied.");
                                instruction.textContent = "Permission denied. Tap to retry.";
                            }
                        })
                        .catch((error) => {
                            console.error("Error requesting motion permission:", error);
                            instruction.textContent = "Error requesting motion access. Retry.";
                        });
                } else {
                    enableShakeDetection();
                    instruction.textContent = "Now shake your device to discover a new album!";
                }
            });
        } else {
            instruction.textContent = "Tap the button to discover a new album.";
            surpriseMeButton.addEventListener("click", surpriseMe);
        }
    }

    // Function to enable shake detection
    function enableShakeDetection() {
        console.log("Shake detection enabled.");
        let lastShakeTime = 0;

        window.addEventListener("devicemotion", (event) => {
            const acceleration = event.acceleration;
            if (acceleration && acceleration.x && acceleration.y && acceleration.z) {
                const totalAcceleration = Math.abs(acceleration.x) + Math.abs(acceleration.y) + Math.abs(acceleration.z);
                if (totalAcceleration > 20) {
                    const now = Date.now();
                    if (now - lastShakeTime > 1000) {
                        lastShakeTime = now;
                        console.log("Shake detected!");
                        surpriseMe();
                    }
                }
            }
        });
    }

    async function surpriseMe() {
        console.log("Surprise Me triggered.");
        
        // Hide the Surprise Me button
        const surpriseMeButton = document.getElementById("surpriseMeButton");
        if (surpriseMeButton) {
            surpriseMeButton.style.display = "none"; // Hide the button
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
    
            // Add fade-in class for animation
            const albumElement = document.querySelector(".album-recommendation");
            albumElement.classList.add("fade-in");
            setTimeout(() => albumElement.classList.remove("fade-in"), 1000); // Remove animation class after 1 second
    
            // Add event listener to the "Add to My List" button
            const addToListButton = document.getElementById("addToListButton");
            addToListButton.addEventListener("click", () => {
                addToMyList(albumDetails.name, albumDetails.artist, albumDetails.cover);
                showToast(`${albumDetails.name} by ${albumDetails.artist} has been added to your list!`);
            });
        } else {
            recommendationContainer.innerHTML = "<p>Sorry, no recommendation could be found at this time.</p>";
        }
    }    

    saveEditButton.addEventListener("click", () => {
        console.log("Save Changes Clicked", currentAlbum);

        const updatedReview = document.getElementById("editReviewText").value.trim();
        const updatedRating = currentAlbum.rating;

        if (updatedReview && updatedRating) {
            const savedLibrary = JSON.parse(localStorage.getItem("albumLibrary")) || [];

            // Update the album data in the library
            if (currentAlbum.index !== undefined) {
                console.log("Updating album at index:", currentAlbum.index);
                savedLibrary[currentAlbum.index] = {
                    ...savedLibrary[currentAlbum.index],
                    review: updatedReview,
                    rating: updatedRating,
                };

                localStorage.setItem("albumLibrary", JSON.stringify(savedLibrary)); // Save changes
                loadAlbumLibrary(); // Refresh the library display
                closeEditPopup(); // Close the popup
                showToast(`Your review for "${currentAlbum.title}" has been updated.`);
            } else {
                console.error("No index found for currentAlbum.");
            }
        } else {
            alert("Please provide both a review and a rating.");
        }
    });

    deleteReviewButton.addEventListener("click", () => {
        console.log("Delete Button Clicked", currentAlbum);

        const savedLibrary = JSON.parse(localStorage.getItem("albumLibrary")) || [];
        if (currentAlbum.index !== undefined) {
            console.log("Deleting album at index:", currentAlbum.index);
            savedLibrary.splice(currentAlbum.index, 1); // Remove the album from the array
            localStorage.setItem("albumLibrary", JSON.stringify(savedLibrary)); // Save the updated library
            loadAlbumLibrary(); // Refresh the library display
            closeEditPopup(); // Close the popup
            showToast(`"${currentAlbum.title}" has been deleted.`);
        } else {
            console.error("No index found for currentAlbum.");
        }
    });



const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];
savedAlbums.forEach(album => {
    if (!album.dateAdded) {
        album.dateAdded = new Date().toISOString(); // Assign a default timestamp
    }
});
localStorage.setItem("savedAlbums", JSON.stringify(savedAlbums));

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

function displaySearchResults(albums) {
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = "";

    const savedLibrary = JSON.parse(localStorage.getItem("albumLibrary")) || [];

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



function addToMyList(albumName, artistName, albumCover) {
    console.log("Adding album:", albumName, artistName, albumCover); // Debugging
    const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];
    const albumExists = savedAlbums.some(album => album.albumName === albumName);

    if (!albumExists) {
        savedAlbums.push({ albumName, artistName, albumCover, dateAdded: new Date().toISOString() });
        localStorage.setItem("savedAlbums", JSON.stringify(savedAlbums));
        showToast(`${albumName} by ${artistName} has been added to your list!`);
    } else {
        showToast(`${albumName} is already in your list!`);
    }
}


function displaySavedAlbums() {
    const savedList = document.getElementById("savedList");
    const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];

    savedList.innerHTML = ""; // Clear previous content

    if (savedAlbums.length === 0) {
        savedList.innerHTML = "<p>Your list is empty!</p>";
        return;
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
            openAlbumOptions(savedAlbums.indexOf(album)); // Pass the original index of the album
        });

        savedList.appendChild(albumDiv);
    });
}





document.addEventListener("DOMContentLoaded", displaySavedAlbums);


function openAlbumOptions(index) {
    const modal = document.getElementById("confirmationModal");
    const confirmButton = document.getElementById("confirmButton");
    const cancelButton = document.getElementById("cancelButton");

    // Show the modal
    modal.style.display = "flex";

    // Handle "Yes" button click
    confirmButton.onclick = () => {
        console.log("Deleting album at index:", index);
        removeAlbum(index); // Ensure the correct album is removed
        modal.style.display = "none"; // Close the modal
        showToast("Album removed successfully!");
    };

    // Handle "No" button click
    cancelButton.onclick = () => {
        modal.style.display = "none"; // Close the modal without action
    };

    // Close the modal when clicking outside of it
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}





function removeAlbum(index) {
    const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];
    console.log("Removing album at index:", index); // Debugging
    console.log("Before removal:", savedAlbums); // Debugging

    savedAlbums.splice(index, 1); // Remove the selected album
    console.log("After removal:", savedAlbums); // Debugging

    localStorage.setItem("savedAlbums", JSON.stringify(savedAlbums));
    displaySavedAlbums(); // Refresh the list
    showToast("Album removed successfully!");
}

let currentAlbum = null;

function openReviewPopup(albumName, albumCover, albumYear, previousReview = null, previousRating = null) {
    // Set current album details
    currentAlbum = { title: albumName, cover: albumCover, year: albumYear };

    // Update popup content
    document.getElementById("albumCover").src = albumCover;
    document.getElementById("albumTitle").textContent = albumName;
    document.getElementById("albumYear").textContent = albumYear;

    // Load previous review or reset textarea
    document.getElementById("reviewText").value = previousReview || "";

    // Reset or load star ratings
    const stars = document.querySelectorAll(".rating-container .star");
    stars.forEach((star, index) => {
        star.classList.toggle("active", previousRating && index < previousRating);
    });

    // Set the current album rating if it exists
    currentAlbum.rating = previousRating || null;

    // Show the popup
    const popup = document.getElementById("reviewPopup");
    popup.style.display = "flex";
}


// Close the review popup when ESC is pressed
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { // Check if the ESC key was pressed
        closeReviewPopup();
    }
});

function closeReviewPopup() {
    const popup = document.getElementById("reviewPopup");
    if (!popup) {
        console.error("Review popup not found");
        return;
    }
    popup.style.display = "none";
}

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

function saveReview() {
    const reviewText = document.getElementById("reviewText").value.trim();
    const rating = currentAlbum.rating;

    if (reviewText && rating) {
        const savedLibrary = JSON.parse(localStorage.getItem("albumLibrary")) || [];
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

        localStorage.setItem("albumLibrary", JSON.stringify(savedLibrary));
        console.log("Saved Library Updated:", savedLibrary); // Debugging
        showToast(`Your review for "${currentAlbum.title}" has been saved successfully!`);
        closeReviewPopup();
        loadAlbumLibrary(); // Reload library display
    } else {
        alert("Please provide a rating and a review before saving.");
    }
}


function loadAlbumLibrary() {
    const savedLibrary = JSON.parse(localStorage.getItem("albumLibrary")) || [];
    const libraryContainer = document.getElementById("libraryList");
    libraryContainer.innerHTML = "";

    savedLibrary.forEach((album, index) => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album-item");
        albumDiv.setAttribute("data-index", index); // Store the index for identification

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
                <button class="edit-button">Edit</button> <!-- Add Edit Button -->
            </div>
        `;

        // Add event listener for the Edit button
        albumDiv.querySelector(".edit-button").addEventListener("click", () => {
            openEditPopup(album, index); // Pass the album and its index
        });

        libraryContainer.appendChild(albumDiv);
    });
}


function openDeletePopup(index) {
    const popup = document.getElementById("deletePopup");
    const confirmDelete = document.getElementById("confirmDelete");

    // Show the delete popup
    popup.style.display = "flex";

    // Add event listener for confirming the deletion
    confirmDelete.onclick = () => deleteReview(index);

    // Close the popup when cancel is clicked
    document.getElementById("cancelDelete").onclick = () => {
        popup.style.display = "none";
    };

    // Close the popup when the close icon is clicked
    document.getElementById("closeDeletePopup").onclick = () => {
        popup.style.display = "none";
    };
}

// Function to open the edit popup
function openEditPopup(album, index) {
    document.getElementById("editAlbumCover").src = album.cover;
    document.getElementById("editAlbumTitle").textContent = album.title;
    document.getElementById("editReviewText").value = album.review || "";

    // Reset and highlight stars
    const stars = document.querySelectorAll("#editPopup .rating-container .star");
    stars.forEach((star, i) => {
        star.classList.toggle("active", i < album.rating);
        star.addEventListener("click", () => setEditRating(i + 1)); // Attach event listener to set rating
    });

    // Store album and its index
    currentAlbum = { ...album, index };
    console.log("Current Album for Editing:", currentAlbum); // Debugging

    // Show the popup
    editPopup.style.display = "flex";
}



// Function to close the edit popup
function closeEditPopup() {
    editPopup.style.display = "none";
}

function setEditRating(rating) {
    const stars = document.querySelectorAll("#editPopup .rating-container .star");
    stars.forEach((star, i) => {
        star.classList.toggle("active", i < rating);
    });
    currentAlbum.rating = rating; // Update the rating in the currentAlbum object
}


function deleteReview(index) {
    const savedLibrary = JSON.parse(localStorage.getItem("albumLibrary")) || [];

    // Remove the album at the specified index
    savedLibrary.splice(index, 1);

    // Save the updated library back to localStorage
    localStorage.setItem("albumLibrary", JSON.stringify(savedLibrary));

    // Refresh the library display
    loadAlbumLibrary();

    // Close the delete popup
    document.getElementById("deletePopup").style.display = "none";
}

// Ensure the library loads when the page is ready
document.addEventListener("DOMContentLoaded", loadAlbumLibrary);


function handleSearch() {
    const query = document.getElementById("albumSearch").value.trim();
    if (query) {
        searchAlbum(query);
    } else {
        alert("Please enter a search term.");
    }
}

document.getElementById("searchButton").addEventListener("click", handleSearch);

document.getElementById("albumSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


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
