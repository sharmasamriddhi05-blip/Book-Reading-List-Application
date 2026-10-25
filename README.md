# Book Reading List Application

A reading list app where you can add books, set their reading status, filter them,
delete them, and see summary counts. Your list is saved in the browser, so it is still
there when you come back.

## Features

- Add a book with a title, an optional author, and a status
- Three statuses: To read, Reading, Finished (change any time from the dropdown)
- Filter the list: All, To read, Reading, Finished
- Delete a book
- Summary counts: total, to read, reading, finished
- Message when the list is empty and a warning when the title is missing
- Books are saved with `localStorage`, so they stay after closing the page

## How to run

Download the files and open `index.html` in any web browser. No installation needed.

## How it works (short)

- `index.html` holds the structure: summary boxes, the form, filter buttons, and an empty list
- `style.css` makes it look good and colors each book by its status
- `script.js` keeps all books in an array, saves it to `localStorage`, and rebuilds the list on screen every time something changes

## Technologies

HTML, CSS, JavaScript

## Author

YOUR NAME
