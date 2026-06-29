package com.polaris.credit.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CreditAccountMapper {

    @Select("SELECT COALESCE(SUM(balance), 0) FROM credit_account")
    Long sumBalance();

}
