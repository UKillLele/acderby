import { Position } from "./Position";

export interface Person {
    id: string,
    name: string,
    number: number,
    imageUrl: string,
    positions: Position[]
}