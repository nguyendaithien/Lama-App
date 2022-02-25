import {MigrationInterface, QueryRunner} from "typeorm";

export class db1645612863907 implements MigrationInterface {
    name = 'db1645612863907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_project\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user_project\` DROP COLUMN \`createdAt\``);
    }

}
