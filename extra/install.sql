-- meetup --

CREATE TABLE meetup (
    meetupID INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    pokemon VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    note MEDIUMTEXT,
    time DATETIME NOT NULL,
    userID VARCHAR(32) NOT NULL,
    messageID VARCHAR(32),
    threadID VARCHAR(32),
    participantListMessageID VARCHAR(32),
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastUpdateTime TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
);

-- meetup participant --

CREATE TABLE meetup_participant (
    meetupID INT(10) NOT NULL,
    userID VARCHAR(32) NOT NULL,
    participants TINYINT(1) NOT NULL DEFAULT 0,
    unsure TINYINT(1) NOT NULL DEFAULT 0,
    remote TINYINT(1) NOT NULL DEFAULT 0,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY (meetupID, userID)
);

-- meetup allowed mentions role --

CREATE TABLE meetup_allowed_mentions_role (
    roleID VARCHAR(255) NOT NULL,
    userID VARCHAR(32) NOT NULL,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY (roleID)
);

-- foreign keys --

ALTER TABLE meetup_participant ADD FOREIGN KEY (meetupID) REFERENCES meetup (meetupID) ON DELETE CASCADE;