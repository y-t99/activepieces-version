import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'app-editable-text',
	templateUrl: './editable-text.component.html',
	styleUrls: ['./editable-text.component.css'],
})
export class EditableTextComponent {
	@Input() value: string | undefined;
	@Input() cssClasses: string;
	@Input() allowClick: boolean = false;
	@Input() allowDoubleClick: boolean = false;
	@Input() disableEditing: boolean = false;
	@Input() viewedTextMaxWidth = '200px';
	@Output() valueChanges: EventEmitter<string> = new EventEmitter<string>();
	@Output() editingChanges: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('editableText') editableText: ElementRef;
	valueOnEditingStarted = '';
	_editing: boolean = false;
	get editing(): boolean {
		return this._editing;
	}

	@Input() set editing(value: boolean) {
		if (value) {
			this.setEditableOn();
		} else {
			this.setEditableOff();
		}
	}

	constructor() {}

	setEditableOff() {
		this._editing = false;
		this.editingChanges.emit(false);
	}

	setEditableOn() {
		if (!this._editing) {
			this._editing = true;
			if (this.value) this.valueOnEditingStarted = this.value.trim();
			this.setSelectionToValue();
		}
		this.editingChanges.emit(true);
	}

	saveTextOnEnter(event: any) {
		if (event.key === 'Enter') {
			//do not allow new line to be put
			event.stopImmediatePropagation();
			this.emitChangedValue();
			this.setEditableOff();
		}
	}

	doubleClickHandler() {
		if (this.disableEditing) return;
		if (this.allowDoubleClick) {
			this.setEditableOn();
		}
	}

	clickHandler() {
		if (this.disableEditing) return;
		if (this.allowClick) {
			this.setEditableOn();
		}
	}
	saveTextOnFocusOut() {
		this.emitChangedValue();
		this.setEditableOff();
	}

	private emitChangedValue() {
		const isValueEmptyOrSameAsBeforeEditingBegun =
			this.editableText.nativeElement.childNodes.length === 0 ||
			this.editableText.nativeElement.childNodes[0].nodeValue.trim().length === 0 ||
			this.editableText.nativeElement.childNodes[0].nodeValue.trim() === this.valueOnEditingStarted;
		if (!isValueEmptyOrSameAsBeforeEditingBegun) {
			this.value = this.editableText.nativeElement.childNodes[0].nodeValue.trim();
			this.valueChanges.emit(this.value);
		} else {
			this.value = this.valueOnEditingStarted;
		}
	}

	setSelectionToEndOfInput() {
		setTimeout(() => {
			if (this.editableText && this.value && window.getSelection && document.createRange) {
				const range = document.createRange();
				const sel = window.getSelection();
				range.setStart(this.editableText.nativeElement.childNodes[0], this.value.length + 1);
				range.collapse(true);
				sel?.removeAllRanges();
				sel?.addRange(range);
			}
		}, 1);
	}
	setSelectionToValue() {
		setTimeout(() => {
			if (this.editableText && this.value && window.getSelection && document.createRange) {
				const range = document.createRange();
				const sel = window.getSelection();
				range.selectNodeContents(this.editableText.nativeElement);
				sel?.removeAllRanges();
				sel?.addRange(range);
			}
		}, 1);
	}
}
