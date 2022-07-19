CREATE TABLE person
(
    id          NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    username    VARCHAR2(255) UNIQUE,
    password    VARCHAR2(1024) UNIQUE,
    phone       char(11) check (phone LIKE '01_________') UNIQUE,
    email       VARCHAR2(319) check (email LIKE '%@gmail.com' || email LIKE '%@yahoo.com') UNIQUE,
    pic_id      NUMBER,
    location_id NUMBER,
    type        VARCHAR2(50),

    CONSTRAINT user_pk PRIMARY KEY (ID),
    CONSTRAINT user_location_fk FOREIGN KEY (location_id) REFERENCES location (location_id)
);


CREATE TABLE owner
(
    owner_id NUMBER NOT NULL,
    CONSTRAINT owner_user_fk FOREIGN KEY (owner_id) REFERENCES person (id)
);

CREATE TABLE tenant
(
    tenant_id      NUMBER NOT NULL,
    job            VARCHAR2(50),
    house_id       NUMBER,
    family_members NUMBER,
    CONSTRAINT tenant_user_fk FOREIGN KEY (tenant_id) REFERENCES person (id),
    CONSTRAINT tenant_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE house
(
    house_id     NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    owner_id     NUMBER NOT NULL,
    created      DATE DEFAULT SYSDATE,
    price        NUMBER,
    vacant       NUMBER,
    floor        NUMBER,
    bedroom      NUMBER,
    bathroom     NUMBER,
    elevator     CHAR(1),
    garage       CHAR(1),
    minimum_stay NUMBER,

    CONSTRAINT house_pk PRIMARY KEY (house_id),
    CONSTRAINT house_owner_fk FOREIGN KEY (owner_id) REFERENCES owner (owner_id)
);

CREATE TABLE location
(
    location_id    NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    street_address VARCHAR2(1000),
    region         VARCHAR2(1000),
    thana          VARCHAR2(1000),
    district       VARCHAR2(1000),

    CONSTRAINT location_pk PRIMARY KEY (location_id)
);

CREATE TABLE deal
(
    deal_id    NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    owner_id   NUMBER NOT NULL,
    house_id   NUMBER NOT NULL,
    tenant_id  NUMBER NOT NULL,
    start_date DATE DEFAULT SYSDATE,
    end_date   DATE,
    price      NUMBER,

    CONSTRAINT deal_pk PRIMARY KEY (deal_id),
    CONSTRAINT deal_owner_fk FOREIGN KEY (owner_id) REFERENCES owner (owner_id),
    CONSTRAINT deal_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT deal_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE request
(
    house_id  NUMBER NOT NULL,
    tenant_id NUMBER NOT NULL,
    time      DATE DEFAULT SYSDATE,

    CONSTRAINT request_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT request_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE follow
(
    house_id  NUMBER NOT NULL,
    tenant_id NUMBER NOT NULL,
    time      DATE DEFAULT SYSDATE,

    CONSTRAINT follow_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT follow_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE leave
(
    house_id  NUMBER NOT NULL,
    tenant_id NUMBER NOT NULL,
    time      DATE DEFAULT SYSDATE,
    duration  NUMBER,

    CONSTRAINT leave_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT leave_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE notification
(
    owner_id  number not null,
    house_id  NUMBER NOT NULL,
    tenant_id NUMBER NOT NULL,
    time      DATE DEFAULT SYSDATE,
    type      varchar2(10),

    CONSTRAINT notification_owner_fk FOREIGN KEY (owner_id) REFERENCES owner (owner_id),
    CONSTRAINT notification_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT notification_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE house_picture
(
    house_id NUMBER NOT NULL,
    picture  BLOB,
--     exterior VARCHAR2(1000),
--     interior VARCHAR2(1000),
--     Rooftop  VARCHAR2(1000),
--     garage   VARCHAR2(1000),

    CONSTRAINT house_picture_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE user_comment
(
    comment_id NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    statement  VARCHAR2(1000),
    time       DATE DEFAULT SYSDATE,

    CONSTRAINT comment_pk PRIMARY KEY (comment_id)
);

CREATE TABLE owner_comment
(
    comment_id NUMBER NOT NULL,
    owner_id   NUMBER,
    tenant_id  NUMBER,

    CONSTRAINT owner_comment_fk FOREIGN KEY (comment_id) REFERENCES user_comment (comment_id)
);

CREATE TABLE tenant_comment
(
    comment_id NUMBER NOT NULL,
    tenant_id  NUMBER,
    house_id   NUMBER,

    CONSTRAINT tenant_comment_fk FOREIGN KEY (comment_id) REFERENCES user_comment (comment_id)
);

CREATE TABLE user_rating
(
    rating_id NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    rating    number check ( rating >= 1 AND rating <= 5 ),
    time      DATE DEFAULT SYSDATE,

    CONSTRAINT rating_pk PRIMARY KEY (rating_id)
);

CREATE TABLE owner_rating
(
    rating_id NUMBER NOT NULL,
    owner_id  NUMBER,
    tenant_id NUMBER,

    CONSTRAINT owner_rating_fk FOREIGN KEY (rating_id) REFERENCES user_rating (rating_id)
);

CREATE TABLE tenant_rating
(
    rating_id NUMBER NOT NULL,
    tenant_id NUMBER,
    house_id  NUMBER,

    CONSTRAINT tenant_rating_fk FOREIGN KEY (rating_id) REFERENCES user_rating (rating_id)
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