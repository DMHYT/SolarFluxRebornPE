var FByteHelper;
(function (FByteHelper) {
    FByteHelper.BBUF_4 = java.lang.ThreadLocal.withInitial(function () { return java.nio.ByteBuffer.allocate(4); });
    function toInt(f) {
        FByteHelper.BBUF_4.get().position(0);
        FByteHelper.BBUF_4.get().putFloat(f);
        FByteHelper.BBUF_4.get().flip();
        return FByteHelper.BBUF_4.get().getInt();
    }
    FByteHelper.toInt = toInt;
    function toFloat(i) {
        FByteHelper.BBUF_4.get().position(0);
        FByteHelper.BBUF_4.get().putInt(i);
        FByteHelper.BBUF_4.get().flip();
        return FByteHelper.BBUF_4.get().getFloat();
    }
    FByteHelper.toFloat = toFloat;
})(FByteHelper || (FByteHelper = {}));
