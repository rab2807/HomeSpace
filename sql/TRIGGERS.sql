create or replace trigger DEAL_TRIGGER
    after insert
    on DEAL
    for each row
begin
    -- update house vacancy info
    update HOUSE
    set VACANT = 'no'
    where HOUSE_ID = :new.HOUSE_ID;

    -- update tenant house info
    update TENANT
    set HOUSE_ID = :new.HOUSE_ID
    where TENANT_ID = :new.TENANT_ID;

    -- make a notification
    insert into NOTIFICATION(house_id, tenant_id, activity_id, notification_type)
    values (:new.house_id, :new.tenant_id, :new.deal_id, 'deal');

    -- remove all the request for the corresponding house
    delete
    from REQUEST
    where HOUSE_ID = :new.HOUSE_ID;
end;

create or replace trigger REQUEST_TRIGGER
    after insert or delete
    on REQUEST
    for each row
begin
    -- after insert make a notification
    if :old.REQUEST_ID is null then
        insert into NOTIFICATION(house_id, tenant_id, activity_id, notification_type)
        values (:new.house_id, :new.tenant_id, :new.request_id, 'request');
    end if;
    -- after delete, delete the notification
    if :new.REQUEST_ID is null then
        delete
        from NOTIFICATION
        where ACTIVITY_ID = :old.request_id
          and NOTIFICATION_TYPE = 'request';
    end if;
end;

create or replace trigger FOLLOW_TRIGGER
    after insert
    on FOLLOW
    for each row
begin
    -- after insert make a notification
    if :old.FOLLOW_ID is null then
        insert into NOTIFICATION(house_id, tenant_id, activity_id, notification_type)
        values (:new.house_id, :new.tenant_id, :new.follow_id, 'follow');
    end if;
    -- after delete, delete the notification
    if :new.FOLLOW_ID is null then
        delete
        from NOTIFICATION
        where ACTIVITY_ID = :old.follow_id
          and NOTIFICATION_TYPE = 'follow';
    end if;
end;

create or replace trigger LEAVE_TRIGGER
    after insert or delete
    on LEAVE
    for each row
begin
    -- after insert make a notification
    if :old.LEAVE_ID is null then
        insert into NOTIFICATION(house_id, tenant_id, activity_id, notification_type)
        values (:new.house_id, :new.tenant_id, :new.leave_id, 'leave');
    end if;
    -- after delete, delete the notification
    if :new.LEAVE_ID is null then
        update HOUSE
        set VACANT = 'yes'
        where HOUSE_ID = :old.HOUSE_ID;

        -- update tenant house info
        update TENANT
        set HOUSE_ID = null
        where TENANT_ID = :old.TENANT_ID;

        -- delete the notification
        delete
        from NOTIFICATION
        where ACTIVITY_ID = :old.leave_id
          and NOTIFICATION_TYPE = 'leave';

        -- convert all follows to requests
        insert into REQUEST(HOUSE_ID, TENANT_ID)
        select HOUSE_ID, TENANT_ID
        from FOLLOW
        where FOLLOW.HOUSE_ID = :old.HOUSE_ID;

        -- remove all follows
        delete
        from FOLLOW
        where HOUSE_ID = :old.HOUSE_ID;

        -- insert end date of the deal
        update DEAL
        set END_DATE = sysdate
        where HOUSE_ID = :old.HOUSE_ID
          and END_DATE is null;
    end if;
end;


