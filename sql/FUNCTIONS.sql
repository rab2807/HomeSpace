create or replace type rating_row as object
(
    rating number,
    count  number
);
/

create or replace type rating_type is table of rating_row;
/

create or replace function GET_RATING(id in number, obj in varchar2)
    return rating_type is
    res rating_type;
begin
    if obj = 'house' then
        select rating_row(rating, count(*)) BULK COLLECT
        INTO res
        from TENANT_TO_HOUSE_REVIEW
        where HOUSE_ID = id
        group by rating;
    elsif obj = 'tenant' then
        select rating_row(rating, count(*)) BULK COLLECT
        INTO res
        from OWNER_TO_TENANT_REVIEW
        where TENANT_ID = id
        group by rating;
    elsif obj = 'owner' then
        select rating_row(rating, count(*)) BULK COLLECT
        INTO res
        from TENANT_TO_HOUSE_REVIEW
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

create or replace function GET_AVG_RATING(id in number, obj in varchar2)
    return number is
    sum1 number;
    sum2 number;
begin
    for R in (select * from GET_RATING(id, obj))
        loop
            sum1 := sum1 + R.rating * R.count;
            sum2 := sum2 + R.count;
        end loop;
    return sum1 / sum2;
end;
/
