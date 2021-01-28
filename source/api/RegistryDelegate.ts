class RegistryDelegate<T> extends java.lang.Object {
    private referent: T;
    private name: string;
    private readonly type: java.lang.Class<T>;
    public constructor(referent: T, type: java.lang.Class<T>){
        super(); this.referent = referent, this.type = type;
    }
    public get(): T {return this.referent};
    public getName(): string {return this.name};
    public getType(): java.lang.Class<T> {return this.type};
    changeReference(newTarget: T): void {this.referent = newTarget};
    public setName(name: string): void {this.name = name};
    public equals(obj: java.lang.Object): boolean {
        if(obj instanceof RegistryDelegate){
            let other: RegistryDelegate<unknown> = obj;
            return other.name == this.name;
        }
    }
    public hashCode(): number {
        return new java.lang.String(this.name).hashCode();
    }
}