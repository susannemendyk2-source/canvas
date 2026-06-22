package com.polaris.common.response;

import com.polaris.common.enums.ResultCode;
import java.io.Serializable;

public class R<T> implements Serializable {

    private int code;
    private String message;
    private T data;
    private long timestamp;

    private R() {
        this.timestamp = System.currentTimeMillis();
    }

    private R(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = System.currentTimeMillis();
    }

    public static <T> R<T> success() {
        return new R<T>(200, "成功/Success", null);
    }

    public static <T> R<T> success(T data) {
        return new R<T>(200, "成功/Success", data);
    }

    public static <T> R<T> failed(ResultCode rc) {
        return new R<T>(rc.getCode(), rc.getMessage(), null);
    }

    public static <T> R<T> failed(ResultCode rc, String msg) {
        return new R<T>(rc.getCode(), msg, null);
    }

    public static <T> R<T> failed(int code, String msg) {
        return new R<T>(code, msg, null);
    }

    public static <T> R<T> ok() {
        return success();
    }

    public static <T> R<T> ok(T data) {
        return success(data);
    }

    public static <T> R<T> error(String msg) {
        return new R<T>(500, msg, null);
    }

    public int getCode() {
        return code;
    }

    public R<T> setCode(int code) {
        this.code = code;
        return this;
    }

    public String getMessage() {
        return message;
    }

    public R<T> setMessage(String message) {
        this.message = message;
        return this;
    }

    public T getData() {
        return data;
    }

    public R<T> setData(T data) {
        this.data = data;
        return this;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public R<T> setTimestamp(long timestamp) {
        this.timestamp = timestamp;
        return this;
    }

}
