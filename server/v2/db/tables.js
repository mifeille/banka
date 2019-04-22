const dbQuery = {
    registerClientTable: `CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastname VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        type VARCHAR(10),
        isadmin VARCHAR(10)

    )` ,

    registerAccountTable: `CREATE TABLE IF NOT EXISTS accounts (
        accountnumber BIGINT PRIMARY KEY,
        createdon TIMESTAMP NOT NULL,
        owner INTEGER NOT NULL,
        type VARCHAR(10) NOT NULL,
        status VARCHAR(128) NOT NULL,
        openingbalance DECIMAL(12,2) NOT NULL,
        balance DECIMAL(12,2) NOT NULL
    )` ,

    registerStaffTable: `CREATE TABLE IF NOT EXISTS staff (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastname VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        type VARCHAR(10),
        isadmin VARCHAR(10)
    )` ,

    registerTransactionTable: `CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        createdon TIMESTAMP NOT NULL,
        type VARCHAR(10) NOT NULL,
        accountnumber BIGINT NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        oldbalance DECIMAL(12,2) NOT NULL,
        newbalance DECIMAL(12,2) NOT NULL

        
    )`,
    registerNotificationTable: `CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        createdon TIMESTAMP NOT NULL,
        owner BIGINT NOT NULL,
        message VARCHAR(128) NOT NULL

        
    )` 
}
export default dbQuery;
