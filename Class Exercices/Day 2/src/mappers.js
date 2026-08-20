export function toProfileDto(row) {
    return {
        playerId: row.player_id,
        displayName: row.display_name,
        playerColor: row.player_color
    };
}

export function toUserDto(row) {
    return {
        userId: row.user_id,
        email: row.email,
        isAdmin: row.is_admin
    };
}