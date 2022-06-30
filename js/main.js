// {
//   id: 3657848524, (string | number)
//   title: 'Harry Potter and the Philosopher\'s Stone', (string)
//   author: 'J.K Rowling', (string)
//   year: 1997, (number)
//   isComplete: false, (boolean)
// }

const books = [];
const searchedBooks = [];
const RENDER_EVENT = 'render-book';
const RENDER_SEARCH = 'render-book-search';

document.addEventListener('DOMContentLoaded', function () {
  const inputBook = document.getElementById('inputBook');
  inputBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  const searchSubmit =  document.getElementById('searchBook');
  searchBook.addEventListener('submit', function (event) {
    event.preventDefault();
    searchBooks();
  });
});

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = parseInt(document.getElementById('inputBookYear').value);
  const isCompleted = document.getElementById('inputBookIsComplete').checked;
 
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor, bookYear, isCompleted);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}
 
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  const incompleteBookshelfLast = document.getElementById('incompleteBookshelfLast');
  incompleteBookshelfLast.innerHTML = '';
 
  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';

  const completeBookshelfLast = document.getElementById('completeBookshelfLast');
  completeBookshelfLast.innerHTML = '';
 
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) 
      incompleteBookshelfList.append(bookElement);    
    else 
      completeBookshelfList.append(bookElement);
  }

  for (const bookLastComplete of books.slice().reverse()) {
    const bookElement = makeBook(bookLastComplete);
    if (bookLastComplete.isCompleted) {
      completeBookshelfLast.append(bookElement);
      break;
    }
  }

  for (const bookLastIncomplete of books.slice().reverse()) {
    const bookElement = makeBook(bookLastIncomplete);
    if (!bookLastIncomplete.isCompleted) {
      incompleteBookshelfLast.append(bookElement);
      break;
    }
  }
});

function makeBook(bookObject) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.title;
 
  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis: ' + bookObject.author;
 
  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun Terbit: ' + bookObject.year;

  const bookStatus = document.createElement('span');

  const statusContainer = document.createElement('p');
  statusContainer.append(bookStatus);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');
 
  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(bookTitle, bookAuthor, bookYear, statusContainer, buttonContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    bookStatus.classList.add('green')
    bookStatus.innerText = 'Selesai';

    const buttonUndo = document.createElement('button');
    buttonUndo.classList.add('undo');
    buttonUndo.addEventListener('click', function() {
    	moveBookToIncomplete(bookObject.id);
    });

    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('delete');
    buttonDelete.addEventListener('click', function() {
    	moveBookToTrash(bookObject.id);
    })

    buttonContainer.append(buttonUndo, buttonDelete);

  } else {
    bookStatus.classList.add('red')
    bookStatus.innerText = 'Belum Selesai'

  	const buttonDone = document.createElement('button');
  	buttonDone.classList.add('done');
  	buttonDone.addEventListener('click', function() {
  		moveBookToComplete(bookObject.id);
  	});

  	const buttonDelete = document.createElement('button');
  	buttonDelete.classList.add('delete');
  	buttonDelete.addEventListener('click', function() {
  		moveBookToTrash(bookObject.id);
  	})

  	buttonContainer.append(buttonDone, buttonDelete);
  }
 
  return container;
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function moveBookToComplete (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function moveBookToTrash (bookId) {
  if (confirm("Anda Ingin Menghapus Buku?")) {
    const bookTarget = findBookIndex(bookId);
    
    if (bookTarget === -1) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}
 
function moveBookToIncomplete (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function searchBooks(bookTitleSearch) {
  const bookTitle = document.getElementById('inputBookTitleSearch');
  const filter = bookTitle.value.toLowerCase();
  for (const bookItem of books) {
    const titleValue = bookItem.title.toLowerCase();
    if (titleValue.includes(filter)) {
      searchedBooks.push(bookItem);
    }
  }
  document.dispatchEvent(new Event(RENDER_SEARCH));
  // console.log(filter);
}

document.addEventListener(RENDER_SEARCH, function () {
  const bookContainer = document.getElementById('searchBookshelfList');
  bookContainer.innerHTML = '';

  const searchContainer = document.getElementById('searchContainer')

  for (const bookItem of searchedBooks) {
    const bookElement = makeBook(bookItem);

    bookContainer.append(bookElement);
  }

  showDiv('search-list');
  searchedBooks.splice(0, searchedBooks.length);
  searchContainer.style.display = 'none';

});
