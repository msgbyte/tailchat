import { Entity, ObjectIdColumn, Column, PrimaryColumn } from 'tushan';

@Entity({
  name: 'users',
})
export class User {
  @ObjectIdColumn()
  _id!: string;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  nickname!: string;

  @Column()
  discriminator!: string;

  @Column({
    default: false,
  })
  temporary!: boolean;

  @Column()
  avatar!: boolean;

  @Column({
    enum: ['normalUser', 'pluginBot', 'openapiBot'],
    default: 'normalUser',
  })
  type: string;

  @Column({
    default: {},
  })
  settings: string;
}
