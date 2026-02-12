/*
    queries.js - Módulo de consultas SQL para endpoints de la aplicación

    - Contiene las consultas SQL para los endpoints definidos en app.js
    -Las consultas incluyen:
    1.- Obtener el historial de todos los préstamos realizados.
    2.- Obtener los préstamos con estatus de no devueltos.
    3.- Obtener los autores con más libros publicados.
 */

const LOANS_ALL = `SELECT u.email, b.title, c.copy_code, l.loan_date, li.due_date, li.return_date
FROM users u
JOIN loans l ON l.user_id = u.user_id
JOIN loan_items li ON li.loan_id = l.loan_id
JOIN copies c ON c.copy_id = li.copy_id
JOIN books b ON b.book_id = c.book_id
ORDER BY u.email, l.loan_date;
`;

const LOANS_NOT_RETURNED = `SELECT b.title, c.copy_code, u.email, l.loan_date, li.due_date, (CURRENT_DATE > li.due_date) AS overdue
FROM copies c
JOIN books b ON b.book_id = c.book_id
JOIN loan_items li ON li.copy_id = c.copy_id
JOIN loans l ON l.loan_id = li.loan_id
JOIN users u ON u.user_id = l.user_id
WHERE li.return_date IS NULL
ORDER BY b.title, c.copy_code;
`;

const AUTHORS_TOP = `SELECT a.name, COUNT(b.book_id) AS num_books
FROM authors a
JOIN books b ON b.author_id = a.author_id
GROUP BY a.author_id, a.name
ORDER BY num_books DESC;
`;

module.exports = { LOANS_ALL, LOANS_NOT_RETURNED, AUTHORS_TOP };