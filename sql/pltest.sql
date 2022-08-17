select HOUSE_ID, AREA, SUBURB, DISTRICT, PRICE, GET_AVG_RATING(HOUSE_ID, 'house') RATING
from house h
         join location l on h.LOCATION_ID = l.LOCATION_ID
where OWNER_ID = :id
order by :sort;

begin
    GET_AVG_RATING(56, 'house');
end;

select *
from GET_RATING(56, 'house');

delete
from OWNER_TO_TENANT_REVIEW;

DECLARE
    num number;
begin
    select nvl(count(*), 0)
    into num
    from BILLING
    where HOUSE_ID IN (select HOUSE_ID
                       from HOUSE
                       where OWNER_ID = :owner_id)
      and MONTH = :month
      and YEAR = :year;

    if num = 0 then
        insert into BILLING
        select H.HOUSE_ID, TENANT_ID, :month, :year, PRICE
        from HOUSE H
                 join TENANT T on H.HOUSE_ID = T.HOUSE_ID
        where H.HOUSE_ID IN (select HOUSE_ID
                             from HOUSE
                             where OWNER_ID = :owner_id)
          and VACANT = 'no';
    end if;
end;

delete from MAINTENANCE;
Commit;