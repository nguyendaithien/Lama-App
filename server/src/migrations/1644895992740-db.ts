import {MigrationInterface, QueryRunner} from "typeorm";

export class db1644895992740 implements MigrationInterface {
    name = 'db1644895992740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`startTime\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`endTime\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`endTime\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`startTime\``);
    }

}
