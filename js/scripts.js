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

        // Check if album has been reviewed
        const reviewedAlbum = savedLibrary.find((saved) => saved.title === album.name);

        albumDiv.innerHTML = `
            <img src="${album.images[0]?.url}" alt="${album.name}" />
            <p><strong>${album.name}</strong> by ${album.artists.map(artist => artist.name).join(", ")}</p>
            <button onclick="addToMyList('${album.name}', '${album.artists.map(artist => artist.name).join(", ")}', '${album.images[0]?.url}')">Add to My List</button>
            <button onclick="openReviewPopup('${album.name}', '${album.images[0]?.url}', '${album.release_date}', ${reviewedAlbum ? `'${reviewedAlbum.review}'` : null}, ${reviewedAlbum ? reviewedAlbum.rating : null})">
                ${reviewedAlbum ? "Review Again" : "Review"}
            </button>
        `;

        resultsContainer.appendChild(albumDiv);
    });
}


function addToMyList(albumName, artistName, albumCover) {
    const savedAlbums = JSON.parse(localStorage.getItem("savedAlbums")) || [];
    const albumExists = savedAlbums.some(album => album.albumName === albumName);

    if (!albumExists) {
        savedAlbums.push({ albumName, artistName, albumCover });
        localStorage.setItem("savedAlbums", JSON.stringify(savedAlbums));
        alert(`${albumName} by ${artistName} has been added to your list!`);
    } else {
        alert(`${albumName} is already in your list!`);
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

    savedAlbums.forEach(album => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album-item");
        albumDiv.innerHTML = `
            <img src="${album.albumCover}" alt="${album.albumName}" class="album-cover" />
            <p><strong>${album.albumName}</strong> by ${album.artistName}</p>
        `;
        savedList.appendChild(albumDiv);
    });
}

document.addEventListener("DOMContentLoaded", displaySavedAlbums);

function loadMyList() {
    const savedAlbums = JSON.parse(localStorage.getItem("myList")) || [];
    const listContainer = document.getElementById("savedList");
    listContainer.innerHTML = "";

    savedAlbums.forEach((album) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${album.albumName} by ${album.artistName}`;
        listContainer.appendChild(listItem);
    });
}

document.addEventListener("DOMContentLoaded", loadMyList);

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
        showToast(`Your review for "${currentAlbum.title}" has been saved successfully!`);
        closeReviewPopup();
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
                <p class="rating">Rating: ${"⭐".repeat(album.rating)}</p>
                <p class="review">${album.review}</p>
            </div>
        `;

        // Add click event to show delete confirmation
        albumDiv.addEventListener("click", () => openDeletePopup(index));

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
