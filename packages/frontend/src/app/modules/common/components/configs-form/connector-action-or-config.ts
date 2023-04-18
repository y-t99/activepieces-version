export enum HttpMethod {
	CONNECT = 'CONNECT',
	DELETE = 'DELETE',
	GET = 'GET',
	HEAD = 'HEAD',
	OPTIONS = 'OPTIONS',
	PATCH = 'PATCH',
	POST = 'POST',
	PUT = 'PUT',
	TRACE = 'TRACE',
}

export interface PieceConfig {
	key: string;
	type: InputType;
	label: string;
	value?: any;
	description?: string;
	authUrl?: string;
	tokenUrl?: string;
	redirectUrl?: string;
	scope?: string[];
	required: boolean;
	extra?: Record<string, unknown>;
	refreshers?: string[];
}

export class PieceProperty {
	name: string;
	description: string;
	type: InputType;
	required: boolean;
	displayName: string;
	authUrl?: string;
	tokenUrl?: string;
	scope?: string[];
	extra?: Record<string, unknown>;
	refreshers?: string[];
}

export const propsConvertor = {
	convertToFrontEndConfig: (name: string, prop: PieceProperty): PieceConfig => {
		return {
			key: name,
			type: prop.type,
			label: prop.displayName,
			description: prop.description,
			authUrl: prop.authUrl,
			tokenUrl: prop.tokenUrl,
			scope: prop.scope,
			required: prop.required,
			extra: prop.extra,
			refreshers: prop.refreshers,
		};
	},
};

export interface AppPiece {
	name: string;
	logoUrl: string;
	actions: propMap;
	triggers: propMap;
	displayName: string;
}

type propMap = Record<
	string,
	{
		displayName: string;
		description: string;
		props: Record<string, PieceProperty>;
	}
>;

export enum InputType {
	SHORT_TEXT = 'SHORT_TEXT',
	LONG_TEXT = 'LONG_TEXT',
	DROPDOWN = 'DROPDOWN',
	NUMBER = 'NUMBER',
	CHECKBOX = 'CHECKBOX',
	OAUTH2 = 'OAUTH2',
}
