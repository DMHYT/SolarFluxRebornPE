abstract class ConfigEntrySerializer<T extends IConfigEntry> {
    public readonly type: string;
    constructor(type: string){
        if(Configuration.serializers.get(type) !== null) throw new java.lang.IllegalArgumentException(`Duplicate config serializer for key \'${type}\'!`);
        Configuration.serializers.put(type, this);
        this.type = type;
    }
    public abstract read(config: Configuration, reader: ReaderHelper, indents: number): T;
    public abstract write(config: Configuration, writer: java.io.BufferedWriter, entry: T, indents: number): void;
    protected writeComment(writer: java.io.BufferedWriter, comment: string, indents: number): void {
        let commentLines: string[] = comment.split("\n");
        for(let i in commentLines){
            let ln: string = commentLines[i];
            this.writeIndents(writer, indents);
            writer.write(`# ${ln}\n`);
        }
    }
    protected writeIndents(writer: java.io.BufferedWriter, indents: number): void {
        let write: string[] = [];
        java.util.Arrays.fill(write, ' ');
        writer.write(write);
    }
}