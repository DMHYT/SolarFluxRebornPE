interface IVariableHandler {
    getVar(id: number): number;
    setVar(id: number, value: number): void;
    getVarCount(): number;
}