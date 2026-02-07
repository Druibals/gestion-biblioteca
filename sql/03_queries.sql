-- 1. List all loan items with user email, book title, copy code, loan date, due date, and return date.

SELECT u.email, b.title, c.copy_code, l.loan_date, li.due_date, li.return_date
FROM users u
JOIN loans l ON l.user_id = u.user_id
JOIN loan_items li ON li.loan_id = l.loan_id
JOIN copies c ON c.copy_id = li.copy_id
JOIN books b ON b.book_id = c.book_id
ORDER BY u.email, l.loan_date;

-- 2. List authors with most books in the library, showing author name and number of books, ordered by number of books descending.

SELECT a.name, COUNT(b.book_id) AS num_books
FROM authors a
JOIN books b ON b.author_id = a.author_id
GROUP BY a.author_id, a.name
ORDER BY num_books DESC;

--3. List all non-returned copies of books with book title, copy code, user email, loan date, and due date.

SELECT b.title, c.copy_code, u.email, l.loan_date, li.due_date, (CURRENT_DATE > li.due_date) AS overdue
FROM copies c
JOIN books b ON b.book_id = c.book_id
JOIN loan_items li ON li.copy_id = c.copy_id
JOIN loans l ON l.loan_id = li.loan_id
JOIN users u ON u.user_id = l.user_id
WHERE li.return_date IS NULL
ORDER BY b.title, c.copy_code;