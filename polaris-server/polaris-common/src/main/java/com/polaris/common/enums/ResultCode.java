package com.polaris.common.enums;

public enum ResultCode {

    SUCCESS(200, "成功/Success"),
    BAD_REQUEST(400, "请求参数错误/Bad request"),
    UNAUTHORIZED(401, "未授权/Unauthorized"),
    FORBIDDEN(403, "无权限/Forbidden"),
    NOT_FOUND(404, "资源不存在/Not found"),
    METHOD_NOT_ALLOWED(405, "请求方法不允许"),
    INTERNAL_ERROR(500, "服务器内部错误"),
    BUSINESS_ERROR(1001, "业务异常"),
    USER_NOT_FOUND(1002, "用户不存在"),
    USER_DISABLED(1003, "用户已被禁用"),
    PASSWORD_ERROR(1004, "密码错误"),
    TOKEN_EXPIRED(1005, "Token已过期"),
    TOKEN_INVALID(1006, "Token无效"),
    CREDITS_INSUFFICIENT(2001, "点数不足"),
    FILE_TOO_LARGE(2002, "文件过大"),
    AI_PROVIDER_ERROR(3001, "AI供应商调用失败");

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

}
