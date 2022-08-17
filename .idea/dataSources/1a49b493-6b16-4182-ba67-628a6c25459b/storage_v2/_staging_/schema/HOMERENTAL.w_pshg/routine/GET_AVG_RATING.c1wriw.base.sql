create function GET_AVG_RATING(id in number, obj in varchar2)
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

