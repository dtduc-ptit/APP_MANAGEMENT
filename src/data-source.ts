import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./common/entities/user.entities";
import { Ticket } from "./common/entities/ticket.entities";
import { Project } from "./common/entities/project.entities";

export const dataSourceOptions: DataSourceOptions= ({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '141203',
    database: 'app_database',
    entities: [User, Ticket, Project],
    synchronize: false,
    migrations: ['src/common/migration/*.ts'],
});

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

//npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate src/common/migration/test --dataSource src/data-source.ts

//npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts   