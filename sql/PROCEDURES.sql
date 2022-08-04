create or replace procedure ADD_USER(username_ in varchar2, password_ in varchar2, phone_ in varchar2,
                                     email_ in varchar2, LID in number, lat in number, lon in number,
                                     area_ in varchar2, suburb_ in varchar2, district_ in varchar2, type_ in varchar2,
                                     category_ in varchar2 default null,
                                     job_ in varchar2 default null, HID in number default null,
                                     members in number default null) is
    id        number;
    loc_count number default 0;
begin
    insert into PERSON(username, password, phone, email, location_id, user_type)
    values (username_, password_, phone_, email_, LID, type_);

    select ID
    into id
    from PERSON
    where PASSWORD = password_
      and EMAIL = email_;

    if type_ = 'owner' then
        insert into OWNER(owner_id, category) VALUES (id, category_);
    else
        insert into TENANT(tenant_id, job, house_id, family_members) values (id, job_, HID, members);
    end if;

    select count(*)
    into loc_count
    from LOCATION
    where LOCATION_ID = lid;

    if loc_count = 0 then
        insert into LOCATION(LOCATION_ID, latitude, longitude, area, suburb, district)
        VALUES (lid, lat, lon, area_, suburb_, district_);
    end if;
end;
/
