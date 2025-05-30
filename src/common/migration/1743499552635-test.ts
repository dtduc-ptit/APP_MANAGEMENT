import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1743499552635 implements MigrationInterface {
    name = 'Test1743499552635'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_d19892d8f03928e5bfc7313780c\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`projectType\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`projectType\` enum ('LABOUR', 'FIX_PRICE', 'MAINTENANCE') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD UNIQUE INDEX \`IDX_34b04f10509ffc80c5bb3231d6\` (\`ticketCode\`)`);
        await queryRunner.query(`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_d19892d8f03928e5bfc7313780c\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_d19892d8f03928e5bfc7313780c\``);
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP INDEX \`IDX_34b04f10509ffc80c5bb3231d6\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`projectType\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`projectType\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_d19892d8f03928e5bfc7313780c\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
