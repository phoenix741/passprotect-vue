import { merge } from '@/utils/lodash';

import { resolver as toolbarResolver, initialStore as toolbarInitialStore } from './toolbar.resolver';
import { resolver as sessionResolver, initialStore as sessionInitialStore } from './session.resolver';
import { resolver as linesResolver, initialStore as linesInitialStore } from './lines.resolver';

export * from './toolbar.event';

export const resolver = merge(toolbarResolver, sessionResolver, linesResolver);
export const initialStore = merge(toolbarInitialStore, sessionInitialStore, linesInitialStore);
