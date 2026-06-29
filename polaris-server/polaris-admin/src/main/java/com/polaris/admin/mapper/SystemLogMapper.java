package com.polaris.admin.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.Map;

@Mapper
public interface SystemLogMapper {

    @Select("<script>"
            + "SELECT l.id, l.module, l.action, l.detail, l.ip, l.created_at as createdAt, "
            + "u.username, u.nickname "
            + "FROM system_log l "
            + "LEFT JOIN user u ON l.user_id = u.id "
            + "<where>"
            + "<if test='type != null and type != \"\"'>AND l.module = #{type}</if>"
            + "<if test='keyword != null and keyword != \"\"'>"
            + "AND (l.detail LIKE CONCAT('%', #{keyword}, '%') OR u.username LIKE CONCAT('%', #{keyword}, '%'))"
            + "</if>"
            + "</where>"
            + "ORDER BY l.created_at DESC "
            + "LIMIT 200"
            + "</script>")
    List<Map<String, Object>> selectLogs(@Param("type") String type, @Param("keyword") String keyword);

    @Insert("INSERT INTO system_log(module, action, user_id, ip, detail) VALUES(#{module}, #{action}, #{userId}, #{ip}, #{detail})")
    void insertLog(@Param("module") String module, @Param("action") String action,
                   @Param("userId") Long userId, @Param("ip") String ip,
                   @Param("detail") String detail);

}
