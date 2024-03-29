import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { DataSource, Repository } from "typeorm";
import { CreateUserDto } from "./requestDto/create-user.dto";
import { UpdateUserDto } from "./requestDto/update-user.dto";
import { plainToInstance } from "class-transformer";
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findAllUser(): Promise<User[]> {
    return await this.find();
  }

  async findOneUser(id: number): Promise<User> {
    return await this.findOne({
      where: { id },
    });
  }

  async findOneUserEmail(user_email: string): Promise<User> {
    return await this.findOne({
      where: { user_email },
    });
  }

  async findOneUserWithContent(id: number): Promise<User> {
    return await this.findOne({
      where: { id },
      relations: ['content'],
    })
  }

  async findOneUserName(user_name: string): Promise<User> {
    return await this.findOne({
      where: { user_name },
    });
  }

  async createUser(createData: CreateUserDto): Promise<User> {
    const user = plainToInstance(User, createData);
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(createData);
      await queryRunner.commitTransaction();
      return user;
    } catch (err){
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = plainToInstance(User, updateData);
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(User, id, updateData);
      await queryRunner.commitTransaction();
      return user;
    } catch (err){
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async deleteUser(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
      .createQueryBuilder(User, 'user')
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute()
      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}