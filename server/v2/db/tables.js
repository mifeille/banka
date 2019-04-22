//const dbQueries = {
   const  registerClientTable = `CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastname VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        type VARCHAR(10),
        isadmin VARCHAR(10)

    )` ;

   const registerAccountTable= `CREATE TABLE IF NOT EXISTS accounts (
        accountnumber BIGINT PRIMARY KEY,
        createdon TIMESTAMP NOT NULL,
        owner INTEGER REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
        type VARCHAR(10) NOT NULL,
        status VARCHAR(128) NOT NULL,
        openingbalance DECIMAL(12,2) NOT NULL,
        balance DECIMAL(12,2) NOT NULL
    )` ;

   const registerStaffTable= `CREATE TABLE IF NOT EXISTS staff (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastname VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        type VARCHAR(10),
        isadmin VARCHAR(10)
    )` ;

   const registerTransactionTable= `CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        createdon TIMESTAMP NOT NULL,
        type VARCHAR(10) NOT NULL,
        accountnumber BIGINT REFERENCES accounts(accountnumber) ON DELETE CASCADE NOT NULL,
        amount DECIMAL(12,2) NOT NULL,
        oldbalance DECIMAL(12,2) NOT NULL,
        newbalance DECIMAL(12,2) NOT NULL

        
    )`;
    const registerNotificationTable= `CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        createdon TIMESTAMP NOT NULL,
        owner INTEGER NOT NULL,
        message VARCHAR(128) NOT NULL
        
    )` 
   
//}
const dbQuery = {
    registerClientTable,
    registerAccountTable,
    registerStaffTable,
    registerTransactionTable,
    registerNotificationTable,

}
export default dbQuery;
