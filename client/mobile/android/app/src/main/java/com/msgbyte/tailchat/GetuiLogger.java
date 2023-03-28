package com.msgbyte.tailchat;

import android.util.Log;

public class GetuiLogger {

  public static boolean ENABLE = true;

  public static final String TAG = "GetuiLogger";

  public static void log(String message){
    if (ENABLE){
      Log.d(TAG, message);
    }
  }
}
