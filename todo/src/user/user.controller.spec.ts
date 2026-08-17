import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserController } from './user.controller';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user list with status OK', () => {
    const statusMock = jest.fn().mockReturnThis();
    const jsonMock = jest.fn();
    const mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
    controller.getUser({} as Request, mockResponse);
    expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
    expect(jsonMock).toHaveBeenCalledWith({
      user1: 'user1',
      user2: 'user2',
    });
  });
});
