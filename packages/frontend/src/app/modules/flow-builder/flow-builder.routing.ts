import { Routes } from '@angular/router';
import { CollectionBuilderComponent } from './page/flow-builder/collection-builder.component';
import { CollectionResolver } from './resolvers/collection.resolver';
import { UserLoggedIn } from '../../guards/user-logged-in.guard';
import { GetInstanceRunResolver } from './resolvers/instance-run.resolver';
import { ListFlowsResolver } from './resolvers/list-flows.resolver';
import { BuilderSavingGuard } from 'src/app/guards/builder-saving.guard';
import { InstacneResolver } from './resolvers/instance.resolver';

export const FlowLayoutRouting: Routes = [
	{
		path: 'flows/:id',
		component: CollectionBuilderComponent,
		resolve: { collection: CollectionResolver, flows: ListFlowsResolver, instance: InstacneResolver },
		canActivate: [UserLoggedIn],
		canDeactivate: [BuilderSavingGuard],
	},
	{
		path: 'runs/:runId',
		component: CollectionBuilderComponent,
		resolve: { runInformation: GetInstanceRunResolver },
		canActivate: [UserLoggedIn],
	},
];
