import {MigrationInterface, QueryRunner} from "typeorm";

export class db1644767524520 implements MigrationInterface {
    name = 'db1644767524520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`isActive\` \`status\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`status\` enum ('Canceled', 'In progress', 'Completed') NOT NULL DEFAULT 'In progress'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`status\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`status\` \`isActive\` tinyint NOT NULL DEFAULT '1'`);
    }

}
