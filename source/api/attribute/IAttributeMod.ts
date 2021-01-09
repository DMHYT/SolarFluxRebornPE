abstract class IAttributeMod extends java.lang.Object {
    abstract operate(give: number): number;
    abstract getValue(): number;
    getLayer(): EnumAttributeLayer {
        return EnumAttributeLayer.ONE;
    }
}