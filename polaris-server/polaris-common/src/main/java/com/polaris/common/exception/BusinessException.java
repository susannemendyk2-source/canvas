package com.polaris.common.exception;

import com.polaris.common.enums.ResultCode;

public class BusinessException extends RuntimeException {

    private final int code;
    private final String message;

    public BusinessException(ResultCode rc) {
        super(rc.getMessage());
        this.code = rc.getCode();
        this.message = rc.getMessage();
    }

    public BusinessException(ResultCode rc, String message) {
        super(message);
        this.code = rc.getCode();
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }

}
