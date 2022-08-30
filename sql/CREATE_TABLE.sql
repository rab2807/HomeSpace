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
    photo       VARCHAR2(1024),
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
    house_id        NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    owner_id        NUMBER NOT NULL,
    profile_picture VARCHAR2(1024),
    created         DATE DEFAULT SYSDATE,
    price           NUMBER,
    vacant          VARCHAR2(10),
    floor           NUMBER,
    bedroom         NUMBER,
    bathroom        NUMBER,
    elevator        CHAR(1),
    garage          CHAR(1),
    NAME            VARCHAR2(512),
    NOTE            VARCHAR2(1024),
    LOCATION_ID     NUMBER,
    SPACE           NUMBER,
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
    request_id   NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    house_id     NUMBER NOT NULL,
    tenant_id    NUMBER NOT NULL,
    request_time DATE DEFAULT SYSDATE,
    CONSTRAINT request_pk PRIMARY KEY (request_id),
    CONSTRAINT request_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT request_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE follow
(
    follow_id   NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    house_id    NUMBER NOT NULL,
    tenant_id   NUMBER NOT NULL,
    follow_time DATE DEFAULT SYSDATE,
    CONSTRAINT follow_pk PRIMARY KEY (follow_id),
    CONSTRAINT follow_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT follow_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE leave
(
    leave_id   NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    house_id   NUMBER NOT NULL,
    tenant_id  NUMBER NOT NULL,
    leave_time DATE DEFAULT SYSDATE,
    CONSTRAINT leave_pk PRIMARY KEY (leave_id),
    CONSTRAINT leave_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT leave_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE notification
(
    owner_id          NUMBER NOT NULL,
    house_id          NUMBER NOT NULL,
    tenant_id         NUMBER NOT NULL,
    activity_id       NUMBER NOT NULL,
    notification_type VARCHAR2(10),
    CONSTRAINT notification_owner_fk FOREIGN KEY (owner_id) REFERENCES owner (owner_id),
    CONSTRAINT notification_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT notification_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE house_picture
(
    house_id NUMBER NOT NULL,
    picture  VARCHAR2(1024),
    CONSTRAINT house_picture_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE owner_to_tenant_review
(
    owner_review_id NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    statement       VARCHAR2(1000),
    rating          NUMBER,
    time            DATE DEFAULT SYSDATE,
    owner_id        NUMBER,
    tenant_id       NUMBER,
    CONSTRAINT owner_review_pk PRIMARY KEY (owner_review_id),
    CONSTRAINT review_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT review_owner_fk FOREIGN KEY (owner_id) REFERENCES owner (owner_id)
);

CREATE TABLE tenant_to_house_review
(
    tenant_review_id NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    statement        VARCHAR2(1000),
    rating           NUMBER,
    time             DATE DEFAULT SYSDATE,
    tenant_id        NUMBER,
    house_id         NUMBER,
    CONSTRAINT tenant_review_pk PRIMARY KEY (tenant_review_id),
    CONSTRAINT review_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT review_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE maintenance
(
    maintenance_id   NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    house_id         NUMBER NOT NULL,
    tenant_id        NUMBER NOT NULL,
    category         VARCHAR2(30),
    details          VARCHAR2(256),
    resolved         VARCHAR2(3),
    cost             NUMBER,
    maintenance_time DATE default SYSDATE,
    CONSTRAINT maintenance_pk PRIMARY KEY (maintenance_id),
    CONSTRAINT maintenance_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT maintenance_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE billing
(
    billing_id NUMBER GENERATED ALWAYS as IDENTITY (START with 1 INCREMENT by 1),
    house_id   NUMBER NOT NULL,
    tenant_id  NUMBER NOT NULL,
    month      NUMBER,
    year       NUMBER,
    paid       NUMBER,
    CONSTRAINT billing_pk PRIMARY KEY (billing_id),
    CONSTRAINT billing_tenant_fk FOREIGN KEY (tenant_id) REFERENCES tenant (tenant_id),
    CONSTRAINT billing_house_fk FOREIGN KEY (house_id) REFERENCES house (house_id)
);

CREATE TABLE message
(
    sender_id   NUMBER references person (id),
    receiver_id NUMBER references person (id),
    time        DATE        default SYSDATE,
    statement   VARCHAR2(1024),
    seen        VARCHAR2(3) default 'no'
);