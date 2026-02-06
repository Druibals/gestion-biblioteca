/* Initial seed data for database: gestion_biblioteca */

-- Sample authors
INSERT INTO authors (name) VALUES
('J.K. Rowling'),
('George R.R. Martin'),
('J.R.R. Tolkien'),
('Agatha Christie'),
('Stephen King');

-- Sample users
INSERT INTO users(name,email) VALUES
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com'),
('Alice Johnson', 'alice.johnson@example.com'),
('Bob Brown', 'bob.brown@example.com'),
('Charlie Davis', 'charlie.davis@example.com');

-- Sample books

INSERT INTO books(title, publish_year, author_id)
SELECT v.title, v.publish_year, a.author_id
FROM (VALUES
    ('The Hobbit', 1937, 'J.R.R. Tolkien'),
    ('A Game of Thrones', 1996, 'George R.R. Martin'),
    ('Harry Potter and the Philosopher''s Stone', 1997, 'J.K. Rowling'),
    ('Murder on the Orient Express', 1934, 'Agatha Christie'),
    ('The Shining', 1977, 'Stephen King')
) AS v(title, publish_year, author_name)
JOIN authors a ON a.name = v.author_name;

-- Sample copies

INSERT INTO copies (copy_code, book_id)
SELECT
    v.prefix || '-' || lpad(s.n::text, 3, '0'),
    b.book_id
FROM (VALUES
    ('The Hobbit', 'HOB', 4),
    ('A Game of Thrones', 'GOT', 3),
    ('Harry Potter and the Philosopher''s Stone', 'HP1', 5),
    ('Murder on the Orient Express', 'MOE', 1),
    ('The Shining', 'SHI', 2)
) AS v(title,prefix,num_copies)
JOIN books b ON b.title = v.title
JOIN generate_series(1, v.num_copies) AS s(n) ON true;

-- Sample loans

INSERT INTO loans (loan_date, user_id)
SELECT CURRENT_DATE -10, user_id
FROM users
WHERE email = 'john.doe@example.com';

INSERT INTO loans (loan_date, user_id)
SELECT CURRENT_DATE -40, user_id
FROM users
WHERE email = 'jane.smith@example.com';

INSERT INTO loans (loan_date, user_id)
SELECT CURRENT_DATE -5, user_id
FROM users
WHERE email = 'alice.johnson@example.com';

-- Sample loan_items

INSERT INTO loan_items (loan_id, copy_id, due_date, return_date)
SELECT
    l.loan_id,
    c.copy_id,
    l.loan_date + 30,
    NULL
FROM loans l
JOIN users u ON u.user_id = l.user_id
JOIN copies c ON c.copy_code IN ('HOB-001', 'HP1-001')
WHERE u.email = 'john.doe@example.com' AND l.loan_date = CURRENT_DATE - 10;

INSERT INTO loan_items (loan_id, copy_id, due_date, return_date)
SELECT
    l.loan_id,
    c.copy_id,
    l.loan_date + 30,
    l.loan_date + 15
FROM loans l
JOIN users u ON u.user_id = l.user_id
JOIN copies c ON c.copy_code = 'SHI-001'
WHERE u.email = 'jane.smith@example.com' AND l.loan_date = CURRENT_DATE - 40;

INSERT INTO loan_items (loan_id, copy_id, due_date, return_date)
SELECT
    l.loan_id,
    c.copy_id,
    l.loan_date + 30,
    NULL
FROM loans l
JOIN users u ON u.user_id = l.user_id
JOIN copies c ON c.copy_code = 'GOT-001'
WHERE u.email = 'alice.johnson@example.com' AND l.loan_date = CURRENT_DATE - 5;