CREATE TABLE location
(
    location_id NUMBER,
    latitude    NUMBER,
    longitude   NUMBER,
    area        VARCHAR2(1000),
    suburb      VARCHAR2(1000),
    district    VARCHAR2(1000),
    CONSTRAINT location_pk PRIMARY KEY (location_id)
);

CREATE TABLE person
(
    id          NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    username    VARCHAR2(255)  NOT NULL,
    password    VARCHAR2(1024) NOT NULL UNIQUE,
    phone       char(11)       NOT NULL UNIQUE,
    email       VARCHAR2(319)  NOT NULL UNIQUE,
    photo       BLOB,
    location_id NUMBER,
    type        VARCHAR2(50),
    CONSTRAINT pass_check check ( password like '%________%'),
    CONSTRAINT phone_check check ( regexp_like(phone, '^01(\d{9})') ),
    CONSTRAINT email_check check (email LIKE '%@gmail.com' OR email LIKE '%@yahoo.com'),
    CONSTRAINT user_pk PRIMARY KEY (ID)
);

CREATE TABLE owner
(
    owner_id NUMBER NOT NULL UNIQUE,
    category VARCHAR2(40),
    CONSTRAINT owner_user_fk FOREIGN KEY (owner_id) REFERENCES person (id)
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

CREATE TABLE tenant
(
    tenant_id      NUMBER NOT NULL UNIQUE,
    job            VARCHAR2(50),
    house_id       NUMBER,
    family_members NUMBER,
    CONSTRAINT tenant_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id),
    CONSTRAINT tenant_user_fk FOREIGN KEY (tenant_id) REFERENCES person (id)
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
    CONSTRAINT house_picture_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE user_review
(
    review_id NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    statement VARCHAR2(1000),
    rating    NUMBER,
    time      DATE DEFAULT SYSDATE,
    CONSTRAINT review_pk PRIMARY KEY (review_id)
);

CREATE TABLE owner_review
(
    review_id NUMBER NOT NULL,
    owner_id  NUMBER,
    tenant_id NUMBER,
    CONSTRAINT owner_comment_fk FOREIGN KEY (review_id) REFERENCES user_review (review_id)
);

CREATE TABLE tenant_review
(
    review_id NUMBER NOT NULL,
    tenant_id NUMBER,
    house_id  NUMBER,
    CONSTRAINT tenant_comment_fk FOREIGN KEY (review_id) REFERENCES user_review (review_id)
);
