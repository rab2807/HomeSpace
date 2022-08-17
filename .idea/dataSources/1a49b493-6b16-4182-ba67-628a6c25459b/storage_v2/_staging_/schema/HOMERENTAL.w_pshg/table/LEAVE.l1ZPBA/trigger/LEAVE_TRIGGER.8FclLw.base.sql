create trigger LEAVE_TRIGGER
    after insert
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

        -- make a notification
        delete
        from NOTIFICATION
        where ACTIVITY_ID = :old.leave_id;

        -- convert all follows to requests
        insert into REQUEST(HOUSE_ID, TENANT_ID)
        select HOUSE_ID, TENANT_ID
        from FOLLOW
        where FOLLOW.HOUSE_ID = :old.HOUSE_ID;

        -- remove all follows
        delete
        from FOLLOW
        where HOUSE_ID = :old.HOUSE_ID;
    end if;
end;
/

