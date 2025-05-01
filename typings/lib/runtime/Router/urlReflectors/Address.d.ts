export class AddressReflector extends BaseReflector {
    absorb: () => void;
    _pushstateHandler: (data: any, title: any, url: any) => any;
    _replacestateHandler: (data: any, title: any, url: any) => any;
    _popstateHandler: (event: any) => Promise<boolean>;
    hooks: any[];
    _reflect: () => void;
    _getRouterUrl(): string;
    _createState(): any;
}
export type AddressReflectorOptions = {
    interceptHistory: boolean;
};
import { BaseReflector } from './ReflectorBase.js';
