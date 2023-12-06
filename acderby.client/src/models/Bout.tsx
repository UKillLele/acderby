import { Person } from "./Person";
import { Team } from "./Team";

export interface Bout {
    id: string,
    name: string,
    date: Date,
    homeTeam: Team,
    homeTeamScore: number,
    homeTeamMVPJammer: Person,
    homeTeamMVPBlocker: Person,
    awayTeam: Team,
    awayTeamScore: number,
    awayTeamMVPJammer: Person,
    awayTeamMVPBlocker: Person,
    imageUrl: string

}