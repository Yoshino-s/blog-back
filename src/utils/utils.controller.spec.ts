import { Test, TestingModule } from '@nestjs/testing';
import { UtilsController } from './utils.controller';
import { Request } from 'express';

const testObject = {
  a: 1,
  b: 'v',
  c: '12ab'
}

describe('Utils Controller', () => {
  let controller: UtilsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilsController],
    }).compile();

    controller = module.get<UtilsController>(UtilsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('headers', () => {
    it('should return headers', () => {
      expect(controller.body(testObject)).toBe(testObject);
    });
  });

  describe('query', () => {
    it('should return query', () => {
      expect(controller.query(testObject)).toBe(testObject);
    });
  });

  describe('body', () => {
    it('should return body', () => {
      expect(controller.body(testObject)).toBe(testObject);
    });
  });
});
