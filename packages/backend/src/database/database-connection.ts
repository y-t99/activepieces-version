import { DataSource } from "typeorm";
import { UserEntity } from "../user/user-entity";
import { ProjectEntity } from "../project/project-entity";
import { CollectionVersionEntity } from "../collections/collection-version/collection-version-entity";
import { CollectionEntity } from "../collections/collection-entity";
import { FlowEntity } from "../flows/flow-entity";
import { FlowVersionEntity } from "../flows/flow-version/flow-version-entity";
import { FileEntity } from "../file/file-entity";
import { StoreEntryEntity } from "../store-entry/store-entry-entity";
import { InstanceEntity } from "../instance/instance-entity";
import { FlowRunEntity } from "../flow-run/flow-run-entity";
import { FlagEntity } from "../flags/flag-entity";
import { system } from "../helper/system/system";
import { SystemProp } from "../helper/system/system-prop";

const database = system.getOrThrow(SystemProp.POSTGRES_DATABASE);
const host = system.getOrThrow(SystemProp.POSTGRES_HOST);
const password = system.getOrThrow(SystemProp.POSTGRES_PASSWORD);
const serializedPort = system.getOrThrow(SystemProp.POSTGRES_PORT);
const port = Number.parseInt(serializedPort, 10);
const username = system.getOrThrow(SystemProp.POSTGRES_USERNAME);

export const databaseConnection = new DataSource({
  type: "postgres",
  host,
  port,
  username,
  password,
  database,
  synchronize: true,
  entities: [
    CollectionEntity,
    CollectionVersionEntity,
    FileEntity,
    FlagEntity,
    FlowEntity,
    FlowVersionEntity,
    InstanceEntity,
    FlowRunEntity,
    ProjectEntity,
    StoreEntryEntity,
    UserEntity,
  ],
});
