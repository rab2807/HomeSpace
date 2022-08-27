create or replace procedure ADD_USER(username_ in varchar2, password_ in varchar2, phone_ in varchar2,
                                     email_ in varchar2, LID in number, lat in number, lon in number,
                                     area_ in varchar2, suburb_ in varchar2, district_ in varchar2, type_ in varchar2,
                                     category_ in varchar2 default null,
                                     job_ in varchar2 default null, HID in number default null,
                                     members in number default null) is
    id number;
begin
    -- insert
    insert into PERSON(username, password, phone, email, location_id, user_type)
    values (username_, password_, phone_, email_, LID, type_);

    -- get the id
    select ID
    into id
    from PERSON
    where PASSWORD = password_
      and EMAIL = email_;

    -- insert into owner/tenant table
    if type_ = 'owner' then
        insert into OWNER(owner_id, category) VALUES (id, category_);
    else
        insert into TENANT(tenant_id, job, house_id, family_members) values (id, job_, HID, members);
    end if;

    -- add location
    ADD_LOCATION(lid, lat, lon, area_, suburb_, district_);
end;

create or replace procedure ADD_LOCATION(id in number, lat in number, lon in number, area_ in varchar2,
                                         suburb_ in varchar2, district_ in varchar2) is
    loc_count number default 0;
begin
    -- check if the location is already in database
    select count(*)
    into loc_count
    from LOCATION
    where LOCATION_ID = id;

    -- insert location
    if loc_count = 0 then
        insert into LOCATION(LOCATION_ID, latitude, longitude, area, suburb, district)
        VALUES (id, lat, lon, area_, suburb_, district_);
    end if;
end;

create or replace procedure UPDATE_USER(userID in number, username_ in varchar2, oldPass in varchar2,
                                        newPass in varchar2, phone_ in varchar2, email_ in varchar2,
                                        category_ in varchar2 default null, job_ in varchar2 default null,
                                        members in number default null) is
    id number;
    p  varchar2(1024);
    t  varchar2(50);
    wrongPass exception;
    pragma exception_init ( wrongPass, -20001 );
begin
    -- update
    update PERSON
    set username = username_,
        phone    = phone_,
        email    = email_
    where ID = userID;

    -- check if old pass is correct. If it is, check if new pass is 8 chars long.
    -- Then approve the new pass, otherwise raise exception
    if newPass != '' or newPass is not null then
        select PASSWORD
        into p
        from PERSON
        where ID = userID;

        if oldPass = p and p like '%________%' then
            update PERSON
            set PASSWORD = newPass,
                USERNAME = 'modon'
            where ID = userID;
        else
            raise wrongPass;
        end if;
    end if;

    -- get id and update owner/tenant table
    select USER_TYPE
    into t
    from PERSON
    where ID = userID;

    if 'owner' = t then
        update OWNER
        set CATEGORY = category_
        where OWNER_ID = userID;
    else
        update TENANT
        set JOB            = job_,
            FAMILY_MEMBERS = members
        where TENANT_ID = userID;
    end if;
end;



