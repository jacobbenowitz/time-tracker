# time-tracker

## Summary

## Technologies Used

## Setup & Run

### 1. MySQL Setup
If you do not have MySQL installed locally, please install the following:
  - [MySQL Server](https://dev.mysql.com/downloads/mysql/)
  - [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
  - Setup Instructions can be found [here](https://medium.com/macoclock/mysql-on-mac-getting-started-cecb65b78e)

### 2. Create Database
```sql
  CREATE DATABASE timetracker;
```

### 3. Create Tables
- Create the *timeentries* table
```sql
  USE timetracker;

  CREATE TABLE timeentries (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(5000),
    status VARCHAR(50),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP,
    PRIMARY KEY (id)
    INDEX (user_id)
  );

  -- Ensure table was created
  DESCRIBE timeentries;
```
- Create the *users* table
```sql
  USE timetracker;

  CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
	  email VARCHAR(320) NOT NULL,
    password_digest VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    INDEX(username, email)
  );

  -- Ensure table was created
  DESCRIBE users;
```