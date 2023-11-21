import { Position } from "./Position";

export default interface Team {
    id: string,
    name: string,
    description: string,
    positions: Position[],
    photoUrl: string,
    logoUrl: string,
    color: string,
    seasonWins: number,
    seasonLosses: number,
    ranking: number
}