import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-loading-icon',
	templateUrl: './loading-icon.component.html',
	styleUrls: ['./loading-icon.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingIconComponent {
	@Input() whiteLoader = false;
	constructor() {}
}
