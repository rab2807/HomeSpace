create or replace function GET_AVG_RATING(id in number, obj in varchar2)
    return number is
    sum1 number default 0;
    sum2 number default 0;
begin
    for R in (select * from GET_RATING(id, obj))
        loop
            sum1 := sum1 + R.rating * R.count;
            sum2 := sum2 + R.count;
        end loop;
    if sum2 = 0 then
        return 0;
    end if;
    return sum1 / sum2;
end;
/

