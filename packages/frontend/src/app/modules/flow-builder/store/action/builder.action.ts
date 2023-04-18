import { createAction, props } from '@ngrx/store';
import { ViewModeEnum } from '../model/enums/view-mode.enum';
import { Collection, Flow, FlowRun, Instance } from 'shared';

export enum BuilderActionType {
	LOAD_INITIAL = '[BUILDER] LOAD_INITIAL',
}

export const loadInitial = createAction(
	BuilderActionType.LOAD_INITIAL,
	props<{ collection: Collection; flows: Flow[]; viewMode: ViewModeEnum; run?: FlowRun; instance?: Instance }>()
);

export const BuilderActions = {
	loadInitial,
};
