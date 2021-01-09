class SimpleAttributeProperty extends IAttributeProperty {
    protected value: number;
    protected base: number;
    protected dirty: boolean = true;
    protected readonly mods: java.util.EnumMap<EnumAttributeLayer, java.util.List<IAttributeMod>> = new java.util.EnumMap()
}