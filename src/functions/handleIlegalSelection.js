import { WHITE, BLACK, isWhite, isBlack } from "../utils/constante.js";
import { legalMoves } from "./legalMoves.js";

export function handleSelection(state, r, c, piece) {
    if (!state.selected) {
        // First click: must be your piece
        if (!piece) return false;
        if (
            (state.turn === WHITE && !isWhite(piece)) ||
            (state.turn === BLACK && !isBlack(piece))
        ) {
            return false;
        }

        state.selected = { r, c };
        state.legal = legalMoves(state.board, r, c, state.turn, state.castling,state.history[state.history.length - 1] || null);
        return true;
    } else {
        // If clicked same color piece, reselect
        if (
            piece &&
            ((state.turn === WHITE && isWhite(piece)) ||
                (state.turn === BLACK && isBlack(piece)))
        ) {
            state.selected = { r, c };
            state.legal = legalMoves(state.board, r, c, state.turn, state.castling, state.history[state.history.length - 1] || null);
            return true;
        }
    }

    return false; // not a selection action
}

