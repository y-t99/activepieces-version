import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';

import { RightSideBarType } from 'src/app/modules/common/model/enum/right-side-bar-type.enum';
import { AddButtonAndFlowItemNameContainer } from 'src/app/modules/common/model/flow-builder/flow-add-button';
import { FlowItem } from 'src/app/modules/common/model/flow-builder/flow-item';
import { FlowRendererService } from 'src/app/modules/flow-builder/service/flow-renderer.service';
import {
	ADD_BUTTON_SIZE,
	ARROW_HEAD_SIZE,
	Drawer,
	FLOW_ITEM_WIDTH,
	SPACE_BETWEEN_ITEM_CONTENT_AND_LINE,
	VERTICAL_LINE_LENGTH,
} from '../draw-utils';
import { AddButtonType } from '../../../../../../../common/model/enum/add-button-type';
import { FlowsActions } from '../../../../../../store/action/flows.action';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-simple-line-connection',
	templateUrl: './simple-line-connection.component.html',
	styleUrls: ['./simple-line-connection.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleLineConnectionComponent implements OnInit, AfterViewInit, OnChanges {
	@ViewChild('addButton') addButtonView: any;
	addButtonAndFlowItemNameContainer: AddButtonAndFlowItemNameContainer;
	@Input() flowItem: FlowItem;
	@Input() viewMode: boolean;

	showDropArea$: Observable<boolean> = new Observable<boolean>();
	drawer: Drawer = new Drawer();
	SVG_HEIGHT: number = SPACE_BETWEEN_ITEM_CONTENT_AND_LINE + VERTICAL_LINE_LENGTH + SPACE_BETWEEN_ITEM_CONTENT_AND_LINE;
	arrowHeadLeft = '0px';
	arrowHeadTop = '0px';
	addButtonLeft = '0px';
	addButtonTop = '0px';
	addButtonSize = { width: `${ADD_BUTTON_SIZE.width}px`, height: `${ADD_BUTTON_SIZE.height}px` };
	constructor(private store: Store, private flowRendererService: FlowRendererService) {}

	drawCommand: string;

	ngOnInit(): void {
		this.drawCommand = [
			this.drawer.move(FLOW_ITEM_WIDTH / 2, SPACE_BETWEEN_ITEM_CONTENT_AND_LINE),
			this.drawer.drawVerticalLine(VERTICAL_LINE_LENGTH),
		].join(' ');
		this.calculateOffsetsForAddButtonAndArrowHead();
		this.showDropArea$ = this.flowRendererService.draggingSubject;
	}

	ngAfterViewInit(): void {
		this.insertAddButtonToRendererServiceListOfContainers();
		this.calculateOffsetsForAddButtonAndArrowHead();
	}

	insertAddButtonToRendererServiceListOfContainers() {
		if (this.addButtonView !== null && this.addButtonView !== undefined) {
			this.addButtonAndFlowItemNameContainer = new AddButtonAndFlowItemNameContainer(
				this.addButtonView.nativeElement,
				this.flowItem.name
			);
			this.flowRendererService.addButtonsWithStepNamesContainers.push(this.addButtonAndFlowItemNameContainer);
		}
	}

	calculateOffsetsForAddButtonAndArrowHead() {
		const strokeWidth = 2;
		this.addButtonTop = `${VERTICAL_LINE_LENGTH / 2}px`;
		this.addButtonLeft = `calc(50% - ${ADD_BUTTON_SIZE.width / 2}px)`;
		this.arrowHeadLeft =
			this.flowItem.boundingBox!.width / 2.0 - ARROW_HEAD_SIZE.width / 2.0 - strokeWidth / 2.0 - 0.5 + 'px';
		this.arrowHeadTop = `${VERTICAL_LINE_LENGTH - 1}px`;
	}

	add() {
		this.store.dispatch(
			FlowsActions.setRightSidebar({
				sidebarType: RightSideBarType.STEP_TYPE,
				props: {
					buttonType: AddButtonType.NEXT_ACTION,
					stepName: this.flowItem.name,
				},
			})
		);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (
			this.addButtonAndFlowItemNameContainer &&
			this.flowItem.name != this.addButtonAndFlowItemNameContainer.stepName
		) {
			const containerInArray = this.flowRendererService.addButtonsWithStepNamesContainers.find(
				item => item == this.addButtonAndFlowItemNameContainer
			);
			if (!containerInArray) {
				console.error('addButtonsWithStepNamesContainer not found');
			} else {
				this.addButtonAndFlowItemNameContainer.stepName = this.flowItem.name;
				containerInArray.stepName = this.flowItem.name;
			}
		}
	}

	hasNextAction() {
		return this.flowItem.nextAction !== undefined && this.flowItem.nextAction !== null;
	}
}
