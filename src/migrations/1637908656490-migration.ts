import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1637908656490 implements MigrationInterface {
    name = 'migration1637908656490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activity" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sessions" ("id" character varying(44) NOT NULL, "user_id" integer, "content" text NOT NULL, "flash" text NOT NULL, "updated_at" integer NOT NULL, "created_at" integer NOT NULL, CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "preferred_name" character varying NOT NULL, "partner_name" character varying NOT NULL, "relationship_start_date" TIMESTAMP NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "progress" ("id" SERIAL NOT NULL, "status" character varying, "date_of_completion" TIMESTAMP, "notes" character varying, "userId" integer NOT NULL, "activityId" integer NOT NULL, CONSTRAINT "PK_79abdfd87a688f9de756a162b6f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "progress" ADD CONSTRAINT "FK_76b5c37e1b005530910d95ab8b8" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_76b5c37e1b005530910d95ab8b8"`);
        await queryRunner.query(`ALTER TABLE "progress" DROP CONSTRAINT "FK_0366c96237f98ea1c8ba6e1ec35"`);
        await queryRunner.query(`DROP TABLE "progress"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "activity"`);
    }

}
