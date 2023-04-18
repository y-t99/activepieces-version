import type {Piece} from '../framework/piece';
import { gmail } from './gmail';
import { slack} from "./slack";
import { github} from "./github";
import { discord } from './discord';
import { hackernews } from './hackernews';
import { hubspot } from './hubspot';
import { mailchimp } from './mailchimp';

export const pieces: Piece[] = [
	slack,
	gmail,
	discord,
	github,
	hubspot,
	hackernews,
	mailchimp
];

export const getPiece = (name: string): Piece | undefined => {
	return pieces.find(f => name.toLowerCase() === f.name.toLowerCase());
}