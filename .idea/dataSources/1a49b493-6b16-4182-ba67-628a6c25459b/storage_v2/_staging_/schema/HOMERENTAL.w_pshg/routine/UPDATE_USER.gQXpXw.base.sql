create procedure UPDATE_USER(userID in number, username_ in varchar2, oldPass in varchar2,
                             newPass in varchar2, phone_ in varchar2, email_ in varchar2,
                             category_ in varchar2 default null, job_ in varchar2 default null,
                             members in number default null) is
    id number;
    p  varchar2(1024);
    t  varchar2(50);
    wrongPass exception;
    pragma exception_init ( wrongPass, -20001 );
begin

    update PERSON
    set username = username_,
        phone    = phone_,
        email    = email_
    where ID = userID;

    if newPass != '' then
        select PASSWORD
        into p
        from PERSON
        where ID = userID;

        if oldPass = p then
            update PERSON
            set PASSWORD = newPass
            where ID = userID;
        else
            raise wrongPass;
        end if;
    end if;

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
/

