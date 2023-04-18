import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';

declare let Prism: any;

@Injectable()
export class HighlightService {
	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

	highlightAll() {
		if (isPlatformBrowser(this.platformId)) {
			Prism.highlightAll();
		}
	}
}
