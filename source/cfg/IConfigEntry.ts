abstract class IConfigEntry {
    abstract getDescription(): string;
    abstract getName(): string;
    abstract getSerializer(): ConfigEntrySerializer<IConfigEntry>;
    getSerializedName(): string {
        return this.getName().replaceAll("=", "\u2248");
    }
}