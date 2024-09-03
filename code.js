document.getElementById('loginBtn').addEventListener('click', function() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (email && password) {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('mainHeader').classList.remove('hidden');
        document.getElementById('mainContent').classList.remove('hidden');
    } else {
        alert('Please enter both email and password.');
    }
});


document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    fetchBooks(query);
});

document.getElementById('searchInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const query = document.getElementById('searchInput').value;
        fetchBooks(query);
    }
});


async function fetchBooks(query) {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
        const data = await response.json();
        displayBooks(data.docs);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}


async function displayBooks(books) {
    const bookDisplay = document.getElementById('bookDisplay');
    bookDisplay.innerHTML = ''; 

    for (const book of books) {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');

        const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'default-cover.jpg';
        const title = book.title || 'No title available';
        const authorIds = book.author_key || [];
        const genre = book.subject ? book.subject.join(', ') : 'Genre not available';
        const description = book.first_sentence ? book.first_sentence.join(' ') : 'No description available';
        const publishDate = book.first_publish_year ? book.first_publish_year : 'Publish date not available';
        const publisher = book.publisher ? book.publisher.join(', ') : 'Publisher not available';
        const pageCount = book.number_of_pages_median ? book.number_of_pages_median : 'Page count not available';

    
        bookCard.innerHTML = `
            <img src="${coverUrl}" alt="Book cover" class="book-cover">
            <h3>${title}</h3>
            <p><strong>Genre:</strong> ${genre}</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Publish Date:</strong> ${publishDate}</p>
            <p><strong>Publisher:</strong> ${publisher}</p>
            <p><strong>Page Count:</strong> ${pageCount}</p>
            <div id="authorDetails-${book.key}" class="author-details-container"></div>
        `;

        bookDisplay.appendChild(bookCard);

    
        for (const authorId of authorIds) {
            await fetchAuthor(authorId, `authorDetails-${book.key}`);
        }
    }
}


async function fetchAuthor(authorId, containerId) {
    try {
        const response = await fetch(`https://openlibrary.org/authors/${authorId}.json`);
        const author = await response.json();
        displayAuthor(author, containerId);
    } catch (error) {
        console.error('Error fetching author:', error);
    }
}


function displayAuthor(author, containerId) {
    const authorDetails = document.getElementById(containerId);
    authorDetails.innerHTML = '';

    const authorCard = document.createElement('div');
    authorCard.classList.add('author-card');
    authorCard.innerHTML = `
        <h4>${author.name || 'Name not available'}</h4>
        <p><strong>Bio:</strong> ${author.bio ? author.bio.value : 'N/A'}</p>
        <p><strong>Books:</strong> ${author.works ? author.works.map(work => work.title).join(', ') : 'N/A'}</p>
    `;
    authorDetails.appendChild(authorCard);
}
