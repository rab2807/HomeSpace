create function GET_RATING(id in number, obj in varchar2)
    return rating_type is
    res rating_type;
begin
    if obj = 'house' then
        select rating_row(rating, count(*))
        BULK COLLECT INTO res
        from USER_REVIEW
                 join TENANT_REVIEW TR on USER_REVIEW.REVIEW_ID = TR.REVIEW_ID
        where HOUSE_ID = id
        group by rating;
    elsif obj = 'tenant' then
        select rating_row(rating, count(*))
        BULK COLLECT INTO res
        from USER_REVIEW
                 join OWNER_REVIEW O on USER_REVIEW.REVIEW_ID = O.REVIEW_ID
        where TENANT_ID = id
        group by rating;
    elsif obj = 'owner' then
        select rating_row(rating, count(*))
        BULK COLLECT INTO res
        from USER_REVIEW
                 join TENANT_REVIEW TR on USER_REVIEW.REVIEW_ID = TR.REVIEW_ID
        where HOUSE_ID in (
            select HOUSE_ID
            from HOUSE
            where OWNER_ID = id
        )
        group by rating;
    end if;
    return res;
end;
/

