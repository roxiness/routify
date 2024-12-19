export class AddressReflector extends BaseReflector {
    absorb: () => void;
    _pushstateHandler: (data: any, title: any, url: any) => boolean;
    _replacestateHandler: (data: any, title: any, url: any) => boolean;
    _popstateHandler: (event: any) => Promise<boolean>;
    hooks: any[];
    _reflect: () => void;
    _getRouterUrl(): string;
    _createState(): any;
}
import { BaseReflector } from './ReflectorBase.js';
