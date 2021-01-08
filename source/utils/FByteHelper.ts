namespace FByteHelper {
    export const BBUF_4: java.lang.ThreadLocal<java.nio.ByteBuffer> = java.lang.ThreadLocal.withInitial(() => java.nio.ByteBuffer.allocate(4));
    export function toInt(f: number): number {
        BBUF_4.get().position(0);
        BBUF_4.get().putFloat(f);
        BBUF_4.get().flip();
        return BBUF_4.get().getInt();
    }
    export function toFloat(i: number): number {
        BBUF_4.get().position(0);
        BBUF_4.get().putInt(i);
        BBUF_4.get().flip();
        return BBUF_4.get().getFloat();
    }
}