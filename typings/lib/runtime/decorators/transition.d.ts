export function transition(config?: Partial<TransitionConfig>, decorator?: Partial<Decorator<Partial<{
    config: Partial<TransitionConfig>;
}>>>): Decorator<Partial<{
    config: Partial<TransitionConfig>;
}>>;
export type TransitionConfig = import('./transition.types.js').TransitionConfig;
