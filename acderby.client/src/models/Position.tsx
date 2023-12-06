import { Person } from "./Person";
import { Team } from "./Team";

export interface Position {
    person: Person | null,
    type: PositionType,
    team: Team | null
}

export enum PositionType {
    member,
    coCaptain,
    captain,
    benchCoach,
    headCoach
}

export function GetPositionDisplayName(position: PositionType | string) {
    switch (position) {
        case PositionType.benchCoach:
        case "benchCoach":
            return "Bench Coach";
        case PositionType.captain:
        case "captain":
            return "Captain";
        case PositionType.coCaptain:
        case "coCaptain":
            return "Co-Captain";
        case PositionType.headCoach:
        case "headCoach":
            return "Head Coach";
        case PositionType.member:
        case "member":
            return "Member";
    }
}

export function GetPositionsArray() {
    return Object.keys(PositionType).filter(key => !isNaN(Number(key))).map(key => Number(key));
}