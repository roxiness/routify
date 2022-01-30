export class AddressReflector extends BaseReflector {
    absorb: () => Promise<boolean>;
    _pushstateHandler: (data: any, title: any, url: any) => boolean;
    _replacestateHandler: (data: any, title: any, url: any) => boolean;
    _popstateHandler: () => Promise<boolean>;
    hooks: any[];
}
import { BaseReflector } from "./ReflectorBase.js";
