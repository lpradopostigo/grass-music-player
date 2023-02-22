CREATE TABLE IF NOT EXISTS track
(
    id               TEXT    NOT NULL,
    release_id       TEXT    NOT NULL,
    artist_credit_id TEXT    NOT NULL,
    name             TEXT    NOT NULL,
    length           REAL    NOT NULL,
    track_number     INTEGER NOT NULL,
    disc_number      INTEGER NOT NULL,
    path             TEXT    NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (release_id) REFERENCES "release" (id),
    FOREIGN KEY (artist_credit_id) REFERENCES artist_credit (id)
)
