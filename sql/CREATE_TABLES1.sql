create TABLE customer (
    ID          NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1), 
    userName    VARCHAR2(255),
    password    VARCHAR2(1024),
    phone       char(11) check (regexp_like(phone, '[:digit:]{11}')),
    email       VARCHAR2(319),
    pic_id      NUMBER NOT NULL,
    job         VARCHAR2(50),
    location_id NUMBER NOT NULL,
    type        VARCHAR2(50),
    CONSTRAINT user_pk primary key (ID)

);


create TABLE owner (
    house_id    NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),  
    CONSTRAINT owner_pk primary key (house_id) 


);

create TABLE tenants(
    house_id        NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),
    family_members  NUMBER NOT NULL,
    CONSTRAINT tenants_owner_fk FOREIGN KEY (house_id) REFERENCES owner(house_id) 

);

create TABLE apartment (
    apartment_id    NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),    
    owner_id        NUMBER NOT NULL,        
    levels          NUMBER NOT NULL,
    lift            CHAR(1),
    parking         CHAR(1),

    CONSTRAINT apartment_pk primary key (apartment_id,owner_id)

);

create TABLE flat ( 
    flat_id         NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),         
    apartment_id    NUMBER NOT NULL,
    owner_id        NUMBER NOT NULL,
    floor_level     NUMBER NOT NULL,
    fee             NUMBER NOT NULL,
    no_of_bedrooms  NUMBER NOT NULL,
    no_of_bathrooms NUMBER NOT NULL,
    vacant          CHAR(1),
    CONSTRAINT flat_pk primary key (flat_id),
    CONSTRAINT flat_apartment_fk FOREIGN KEY (apartment_id,owner_id) REFERENCES apartment(apartment_id,owner_id)

);

create TABLE location (
    location_id     NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1), 
    street_address  VARCHAR2(1000),
    region          VARCHAR2(1000),
    thana           VARCHAR2(1000),
    district        VARCHAR2(1000),

    CONSTRAINT location_pk primary key (location_id)

);

create TABLE deal(
    deal_id     NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1),     
    owner_id    NUMBER NOT NULL,
    apartment_id NUMBER NOT NULL, 
    tenant_id   NUMBER NOT NULL UNIQUE, 
    flat_id     NUMBER NOT NULL UNIQUE,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    fee         NUMBER NOT NULL,

    CONSTRAINT deal_pk primary key (deal_id),
    CONSTRAINT deal_aparment_fk FOREIGN KEY (apartment_id,owner_id) REFERENCES apartment(apartment_id,owner_id),
    CONSTRAINT deal_flat_fk FOREIGN KEY(flat_id) REFERENCES flat(flat_id)  

);

--according to sir's wish
create TABLE request(
    request_id  NUMBER GENERATED ALWAYS as IDENTITY(START with 1 INCREMENT by 1), 
    owner_id    NUMBER NOT NULL ,
    apartment_id NUMBER NOT NULL,
    house_id    NUMBER NOT NULL,
    tenant_id   NUMBER NOT NULL UNIQUE,  
    time        DATE NOT NULL,

    CONSTRAINT request_pk primary key (request_id),
    CONSTRAINT request_aparment_fk FOREIGN KEY (apartment_id,owner_id) REFERENCES apartment(apartment_id,owner_id),
    CONSTRAINT housepictures_owner_fk FOREIGN KEY (house_id) REFERENCES owner(house_id) 


);

create TABLE housepictures(
    house_id    NUMBER NOT NULL,
    exterior    VARCHAR2(1000),
    interior    VARCHAR2(1000),
    Rooftop     VARCHAR2(1000),
    garage      VARCHAR2(1000),

    CONSTRAINT housepictures_owner_fk FOREIGN KEY (house_id) REFERENCES owner(house_id) 



);

create TABLE flatpictures(
    flat_id     NUMBER NOT NULL,
    bedroom     VARCHAR2(1000),
    dining_room VARCHAR2(1000),
    kitchen     VARCHAR2(1000),
    bathroom    VARCHAR2(1000),
    store_room  VARCHAR2(1000),

    CONSTRAINT flatpictures_flat_fk FOREIGN KEY(flat_id) REFERENCES flat(flat_id)

);

create TABLE review(
    --review_id   NUMBER NOT NULL,
    rating      NUMBER NOT NULL,   
    comments     VARCHAR2(1024), 
    post_time    DATE NOT NULL,
    update_time  DATE NOT NULL,
    type        VARCHAR2(50)
    --CONSTRAINT review_pk primary_key (review_id)
);


create TABLE tenant_review(
    owner_id    NUMBER NOT NULL,
    apartment_id NUMBER NOT NULL,
    tenant_id   NUMBER NOT NULL UNIQUE,

    CONSTRAINT tenant_review_aparment_fk FOREIGN KEY (apartment_id,owner_id) REFERENCES apartment(apartment_id,owner_id)



);

create TABLE house_review(
    tenant_id   NUMBER NOT NULL,
    flat_id     NUMBER NOT NULL,

    CONSTRAINT house_review_flat_fk FOREIGN KEY(flat_id) REFERENCES flat (flat_id) 


);


-- --to add new column use alter
-- alter table table_name
--         add column_name datatype

-- -- Alter a Relational table to add a column

-- ALTER TABLE TABLE1 ADD
-- (
--   Column4 VARCHAR2(40)
-- );

-- --to delete a column use drop 

-- alter table table_name
--         drop column column_name