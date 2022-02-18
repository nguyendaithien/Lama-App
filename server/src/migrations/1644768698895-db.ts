import {MigrationInterface, QueryRunner} from "typeorm";

export class db1644768698895 implements MigrationInterface {
    name = 'db1644768698895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`avatar\``);
    }

}
