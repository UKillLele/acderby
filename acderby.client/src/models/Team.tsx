import { Position } from "./Position";

export interface Team {
    id: string,
    name: string,
    description: string,
    positions: Position[],
    imageUrl: string,
    logoUrl: string,
    color: string,
    seasonWins: number,
    seasonLosses: number,
    ranking: number,
    defaultSkaterImage: string
}