create or replace function GET_RATING(id in number, obj in varchar2)
    return rating_type is
    res rating_type;
begin
    if obj = 'house' then
        select rating_row(rating, count(*)) BULK COLLECT
        INTO res
        from TENANT_TO_HOUSE_REVIEW
        where HOUSE_ID = id
        group by rating
        order by rating;
    elsif obj = 'tenant' then
        select rating_row(rating, count(*)) BULK COLLECT
        INTO res
        from OWNER_TO_TENANT_REVIEW
        where TENANT_ID = id
        group by rating
        order by rating;
    elsif obj = 'owner' then
        select rating_row(rating, count(*)) BULK COLLECT
        INTO res
        from TENANT_TO_HOUSE_REVIEW
        where HOUSE_ID in (
            select HOUSE_ID
            from HOUSE
            where OWNER_ID = id
        )
        group by rating
        order by rating;
    end if;
    return res;
end;
/