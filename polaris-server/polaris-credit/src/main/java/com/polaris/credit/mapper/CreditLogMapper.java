package com.polaris.credit.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CreditLogMapper {

    @Select("SELECT COALESCE(SUM(amount), 0) FROM credit_log WHERE amount > 0")
    Long sumIssued();

    @Select("SELECT COALESCE(SUM(amount), 0) FROM credit_log WHERE amount < 0")
    Long sumSpent();

}
