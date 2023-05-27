CREATE TABLE IF NOT EXISTS "release"
(
    id               TEXT    NOT NULL,
    artist_credit_id TEXT    NOT NULL,
    name             TEXT    NOT NULL,
    date             TEXT    NOT NULL,
    total_tracks     INTEGER NOT NULL,
    total_discs      INTEGER NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (artist_credit_id) REFERENCES artist_credit (id)
)