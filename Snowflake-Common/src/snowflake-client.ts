import * as snowflake from "snowflake-sdk"

export class SnowflakeClient {
    private readonly account: string;
    private readonly username: string;
    private readonly password: string;
    private readonly application: string;

    constructor(account: string, username: string, password: string, application: string) {
        this.account = account;
        this.username = username;
        this.password = password;
        this.application = application;
    }

    public async doRequest(sqlCommand: string, binds: any[]): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            let connection = snowflake.createConnection({
                account: this.account,
                username: this.username,
                password: this.password,
                application: this.application
            });
            connection.connect(
                function (err, conn) {
                    if (err) {
                        reject('Unable to connect: ' + err.message);
                    } else {
                        console.log('Successfully connected to Snowflake.');
                    }
                }
            );
            connection.execute({
                sqlText: sqlCommand,
                binds: binds,
                complete: function(err, stmt, rows) {
                    if (err) {
                        console.error('Failed to execute statement due to the following error: ' + err.message);
                        reject('Failed to execute statement due to the following error: ' + err.message);
                    } else {
                        console.log('Successfully executed statement: ' + stmt.getSqlText());
                        resolve(rows);
                    }
                }
            });
        });
    }
}