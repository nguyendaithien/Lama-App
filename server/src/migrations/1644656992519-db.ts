import {MigrationInterface, QueryRunner} from "typeorm";

export class db1644656992519 implements MigrationInterface {
    name = 'db1644656992519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`salt\` \`salt\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`salt\` \`salt\` varchar(255) NOT NULL`);
    }

}
