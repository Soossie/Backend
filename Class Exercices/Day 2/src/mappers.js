export function toProfileDto(row) {
    return {
        playerId: row.player_id,
        displayName: row.display_name,
        playerColor: row.player_color
    };
}
