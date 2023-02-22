CREATE TABLE IF NOT EXISTS artist_credit_part
(
    artist_credit_id TEXT NOT NULL,
    artist_id        TEXT NOT NULL,
    PRIMARY KEY (artist_credit_id, artist_id),
    FOREIGN KEY (artist_credit_id) REFERENCES artist_credit (id),
    FOREIGN KEY (artist_id) REFERENCES artist (id)
)