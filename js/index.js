document.addEventListener("DOMContentLoaded", function() {
    const baseUrl = 'http://localhost:3000/books';
    const bookUl = document.querySelector('#list');
    const bookInfo = document.querySelector('#show-panel');
    let currentUser = { "id": 1, "username": "pouros" };
    const bookUsersUl = document.createElement('ul');

    const booksList = () => {
        fetch(baseUrl)
            .then(response => response.json())
            .then(bookObject => {
                bookObject.forEach(book => renderBooks(book))
            });
    };

    const renderBooks = (book) => {
        const bookLi = document.createElement('li');
        bookLi.textContent = book.title;
        bookLi.className = 'book-li';
        bookLi.dataset.id = book.id;
        bookUl.append(bookLi);
        renderThumbnail(book, bookLi)
    };

    const renderThumbnail = (book, bookLi) => {
        bookLi.addEventListener("click", (e) => {
            bookDiv(book);
        });
    };

    const bookDiv = (book) => {
        bookInfo.innerHTML = ``;
        const bookImage = document.createElement("div");
        bookImage.innerHTML = `
            <img src="${book.img_url}">
        `;
        const bookTitle = document.createElement("h2");
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement("h3");
        bookAuthor.textContent = book.author;

        const bookSubtitle = document.createElement('h4');
        bookSubtitle.textContent = book.subtitle;

        const bookDis = document.createElement('p');
        bookDis.textContent = book.description;

        const likeButton = document.createElement('button')
        likeButton.innerText = 'LIKE';
        bookInfo.append(bookImage, bookTitle, bookAuthor, bookSubtitle, bookDis, likeButton);

        addUser(likeButton, book);
        renderUsers(book.users);
    };

    const addUser = (likeButton, book) => {
        likeButton.addEventListener('click', (e) => {
            if (likeButton.innerText === 'LIKE') {
                book.users.push(currentUser);
                renderUsers(book.users)
                likeButton.innerText = 'UNLIKE';
            }
            else if (likeButton.innerText === 'UNLIKE') {
                const users = book.users.filter(user => user.id != currentUser.id);
                fetch(`${baseUrl}/${book.id}`, {
                    method: 'PATCH',
                    headers: {
                        'content-type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ users: users })
                })
                .then(response => response.json())
                .then(book => renderUsers(book.users))
                likeButton.innerText = 'LIKE';
            };
        });
    }


    const renderUsers = (bookUser) => {
        bookUsersUl.innerHTML = ``;
        bookUser.forEach(user => {
            const userLi = document.createElement('li');
            userLi.textContent = user.username;
            bookUsersUl.append(userLi);
        });
        bookInfo.append(bookUsersUl);
    };

    booksList();
})
