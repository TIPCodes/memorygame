document.addEventListener('DOMContentLoaded', function () {
    // Event listener that triggers when the DOM content is fully loaded

    let cards = [];
    let flippedCards = [];
    let matchedCards = [];
    // Arrays to keep track of cards, flipped cards, and matched cards

    async function fetchImages() {
        try {
            const response = await fetch('assets/images-list.json');
            // Fetches the JSON file containing the list of image filenames
            if (!response.ok) {
                throw new Error(`Failed to fetch JSON: ${response.status} ${response.statusText}`);
            }

            const imageList = await response.json();
            // Parses the JSON file to get the list of image filenames
            cards = imageList.map(image => `assets/${image}`);
            // Constructs the URLs for the images and assigns them to the 'cards' array
            return cards;
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    }

    function createGameBoard() {
        const gameBoard = document.getElementById('game-board');
        // Retrieves the game board container element

        gameBoard.innerHTML = '';
        // Clears the game board before creating new cards

        cards.forEach((image, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
        // Creates card elements for each image and appends them to the game board

        const columns = 4;
        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        // Sets up the grid with the correct number of columns
    }

    function flipCard() {
        const selectedCard = this;
        // Retrieves the selected card element
        if (flippedCards.length < 2 && !flippedCards.includes(selectedCard)) {
            flippedCards.push(selectedCard);
            // Adds the selected card to the array of flipped cards
            selectedCard.style.backgroundImage = `url(${cards[selectedCard.dataset.index]})`;
            // Displays the image on the flipped card

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
            // Checks for a match after a short delay
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.style.backgroundImage === card2.style.backgroundImage) {
            matchedCards.push(card1, card2);
            flippedCards = [];

            if (matchedCards.length === cards.length) {
                alert('Congratulations! You matched all the cards.');
            }
            // Displays a congratulations message if all cards are matched
        } else {
            setTimeout(() => {
                card1.style.backgroundImage = 'none';
                card2.style.backgroundImage = 'none';
                flippedCards = [];
            }, 500);
            // Flips back the cards if they do not match after a short delay
        }
    }

    function resetGame() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedCards = [];

        fetchImages().then(() => {
            cards = cards.concat(cards.slice());
            cards.sort(() => Math.random() - 0.5);
            createGameBoard();
        });
    }

    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetGame);
    // Adds an event listener to the reset button to trigger the resetGame function

    fetchImages().then(() => {
        createGameBoard();
        resetGame(); // Calls resetGame after fetchImages to initialize the grid properly
    });
    // Fetches images, creates the game board, and initializes the game with a reset
});

