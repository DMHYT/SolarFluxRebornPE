/**
 * This Java code was compiled on another mod project with toolchain,
 * because I didn't want to setup toolchain here 0_0
 * This source code is just for showing!
 */

package ua.vsdum.sfrpe;

import java.util.HashMap;

import com.zhekasmirnov.horizon.runtime.logger.Logger;

import org.mozilla.javascript.ScriptableObject;

public class Main {

    private static final int[] MULTIPLY_DE_BRUIJN_BIT_POSITION = new int[]{0, 1, 28, 2, 29, 14, 24, 3, 30, 22, 20, 15, 25, 17, 4, 8, 31, 27, 13, 23, 21, 19, 16, 7, 26, 12, 18, 6, 11, 5, 10, 9};

    private static int roundUpToPowerOfTwo(int value)
    {
        int i = value - 1;
        i = i | i >> 1;
        i = i | i >> 2;
        i = i | i >> 4;
        i = i | i >> 8;
        i = i | i >> 16;
        return i + 1;
    }

    private static boolean isPowerOfTwo(int value)
    {
        return value != 0 && (value & value - 1) == 0;
    }

    private static int calculateLogBaseTwoDeBruijn(int value)
    {
        value = isPowerOfTwo(value) ? value : roundUpToPowerOfTwo(value);
        return MULTIPLY_DE_BRUIJN_BIT_POSITION[ (int) ((long) value * 125613361L >> 27) & 31 ];
    }

    private static int calculateLogBaseTwo(int value)
    {
        return calculateLogBaseTwoDeBruijn(value) - (isPowerOfTwo(value) ? 0 : 1);
    }

    public static void boot(HashMap<?, ?> data)
    {
        Logger.debug("SolarFluxRebornPE", "Loading java side...");
    }

    public Main() {}

    private static final int NUM_X_BITS = 1 + calculateLogBaseTwo(roundUpToPowerOfTwo(30000000));
    private static final int NUM_Z_BITS = NUM_X_BITS;
    private static final int NUM_Y_BITS = 64 - NUM_X_BITS - NUM_Z_BITS;
    private static final int Y_SHIFT = 0 + NUM_Z_BITS;
    private static final int X_SHIFT = Y_SHIFT + NUM_Y_BITS;
    private static final long X_MASK = (1L << NUM_X_BITS) - 1L;
    private static final long Y_MASK = (1L << NUM_Y_BITS) - 1L;
    private static final long Z_MASK = (1L << NUM_Z_BITS) - 1L;
    
    public long toLong(int x, int y, int z)
    {
        return ( (long) x & X_MASK ) << X_SHIFT | ( (long) y & Y_MASK ) << Y_SHIFT | ( (long) z & Z_MASK) << 0;
    }

    public void fromLong(long serialized, ScriptableObject blockposobj)
    {
        int x = (int) (serialized << 64 - X_SHIFT - NUM_X_BITS >> 64 - NUM_X_BITS);
        int y = (int) (serialized << 64 - Y_SHIFT - NUM_Y_BITS >> 64 - NUM_Y_BITS);
        int z = (int) (serialized << 64 - NUM_Z_BITS >> 64 - NUM_Z_BITS);
        blockposobj.put("x", blockposobj, Integer.valueOf(x));
        blockposobj.put("y", blockposobj, Integer.valueOf(y));
        blockposobj.put("y", blockposobj, Integer.valueOf(z));
    }

}
