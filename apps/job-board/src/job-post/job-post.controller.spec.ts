import type { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  JobPostController,
  type TCreatePostParams,
} from './job-post.controller';
import type { JobPostDatabase } from './job-post.database';
import { JobPost } from './job-post.entity';
import { JobPostService } from './job-post.service';

describe('JobPostController', () => {
  let controller: JobPostController;

  const mockJobPostDatabase = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<JobPostDatabase>;

  const mockJobPost = new JobPost({
    id: '1',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    employmentType: 'on-site',
    userId: 'user1',
  });
  const mockJobPost2 = new JobPost({
    id: '2',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    employmentType: 'on-site',
    userId: 'user1',
  });

  const mockLogger = {
    error: jest.fn(),
  } as unknown as Logger;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostController],
      providers: [
        {
          provide: JobPostService,
          useFactory: () => new JobPostService(mockJobPostDatabase, mockLogger),
        },
      ],
    }).compile();
    controller = module.get<JobPostController>(JobPostController);
  });

  describe('findAll', () => {
    it('should return empty array when no posts exist', async () => {
      mockJobPostDatabase.findAll.mockResolvedValue({
        ok: true,
        data: [],
      });
      const result = await controller.findAll({ userId: 'user1' });
      expect(result).toEqual([]);
    });

    it('should return multiple job posts', async () => {
      const mockPosts = [mockJobPost, mockJobPost2];
      mockJobPostDatabase.findAll.mockResolvedValue({
        ok: true,
        data: mockPosts,
      });
      const result = await controller.findAll({ userId: 'user1' });
      expect(result).toEqual(mockPosts);
      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a job post when it exists', async () => {
      mockJobPostDatabase.findById.mockResolvedValue({
        ok: true,
        data: mockJobPost,
      });
      const result = await controller.findOne('1', { userId: 'user1' });
      expect(result).toEqual(mockJobPost);
    });

    it('should throw error when post does not exist', async () => {
      mockJobPostDatabase.findById.mockResolvedValue({
        ok: false,
        error: 'Job post not found',
      });
      await expect(
        controller.findOne('999', { userId: 'user1' })
      ).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new job post', async () => {
      const createParams: TCreatePostParams = {
        title: 'New Job',
        description: 'Description',
        salary: 60000,
        employmentType: 'remote',
      };

      mockJobPostDatabase.create.mockResolvedValue({
        ok: true,
        id: '3',
      });
      const result = await controller.create({ userId: 'user1' }, createParams);
      expect(result.id).toBe('3');
      expect(result.title).toBe(createParams.title);
      expect(result.description).toBe(createParams.description);
      expect(result.salary).toBe(createParams.salary);
      expect(result.employmentType).toBe(createParams.employmentType);
      expect(result.userId).toBe('user1');
    });

    it('should throw error when an error occurs', async () => {
      mockJobPostDatabase.create.mockResolvedValue({
        ok: false,
        id: '',
        error: 'Creation failed',
      });
      await expect(
        controller.create({ userId: 'user1' }, {
          title: 'New Job',
          description: 'Description',
          salary: 60000,
          employmentType: 'remote',
        } as TCreatePostParams)
      ).rejects.toThrow();
    });

    it('should throw error when an invalid payload is given', async () => {
      await expect(
        controller.create(
          { userId: 'user1' },
          {
            // @ts-expect-error Testing invalid payload
            foo: 'bar',
          }
        )
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update an existing job post', async () => {
      mockJobPostDatabase.update.mockResolvedValue({
        ok: true,
        id: '1',
      });

      const result = await controller.update(
        '1',
        { userId: 'user1' },
        {
          title: 'Updated Title',
          description: 'Description',
          salary: 60000,
          employmentType: 'remote',
        }
      );
      expect(result.title).toBe('Updated Title');
    });

    it('should throw error when post does not exist', async () => {
      mockJobPostDatabase.update.mockResolvedValue({
        ok: false,
        id: '999',
        error: 'Job post not found',
      });
      await expect(
        controller.update(
          '999',
          { userId: 'user1' },
          {
            title: 'New Title',
            description: 'Description',
            salary: 60000,
            employmentType: 'remote',
          }
        )
      ).rejects.toThrow();
    });

    it('should throw error when an invalid payload is given', async () => {
      await expect(
        controller.update(
          '999',
          { userId: 'user1' },
          {
            title: 'New Title',
            description: 'Description',
            // @ts-expect-error Testing invalid payload
            foo: 'bar',
            employmentType: 'remote',
          }
        )
      ).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete an existing job post', async () => {
      mockJobPostDatabase.delete.mockResolvedValue({
        ok: true,
        id: '1',
      });

      const result = await controller.remove('1', { userId: 'user1' });
      expect(result).toBeUndefined();
    });

    it('should throw error when deleting non-existent post', async () => {
      mockJobPostDatabase.delete.mockResolvedValue({
        ok: false,
        id: '999',
        error: 'Job post not found',
      });
      await expect(
        controller.remove('999', { userId: 'user1' })
      ).rejects.toThrow();
    });
  });
});
