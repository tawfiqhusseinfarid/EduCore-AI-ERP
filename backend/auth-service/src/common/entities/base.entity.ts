export abstract class BaseEntity {

  id!: number;

  active!: boolean;

  entryUser?: number;

  entryDate!: Date;

  updateUser?: number;

  updateDate?: Date;

}