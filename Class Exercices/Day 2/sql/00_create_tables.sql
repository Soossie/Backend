CREATE TABLE users
(
    user_id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

CREATE TABLE player_profiles
(
    player_id UUID PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    player_color TEXT NOT NULL
);
