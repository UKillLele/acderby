import { Position } from "./Position";

export interface Person {
    id: string,
    name: string,
    number: string,
    imageUrl: string,
    positions: Position[]
}