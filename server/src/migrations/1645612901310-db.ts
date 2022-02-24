import {MigrationInterface, QueryRunner} from "typeorm";

export class db1645612901310 implements MigrationInterface {
    name = 'db1645612901310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_team\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_team\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`user_team\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_team\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`user_team\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user_team\` DROP COLUMN \`createdAt\``);
    }

}
