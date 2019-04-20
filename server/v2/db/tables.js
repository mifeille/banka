const dbQuery = {
    registerClientTable: `CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(128) NOT NULL,
        lastname VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL,
        type VARCHAR(10)
    )` 
        
}
export default dbQuery;
