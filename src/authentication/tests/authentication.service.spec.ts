import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../../users/users.service';
import User from '../../users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { getRepositoryToken } from '@nestjs/typeorm';
import mockedJwtService from '../../utils/mocks/jwt.service';
import mockedConfigService from '../../utils/mocks/config.service';
import Address from 'src/users/address.entity';

jest.mock('bcrypt');

const mockedUser: User = {
  id: 1,
  email: 'user@email.com',
  name: 'John',
  password: 'hash',
  address: {
    id: 1,
    street: 'streetName',
    city: 'cityName',
    country: 'countryName',
  } as Address,
  posts: [],
};

describe('The AuthenticationService', () => {
  let bcryptCompare: jest.Mock;
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let userData: User;
  let findUser: jest.Mock;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
    }).compile();
    authenticationService = await module.get<AuthenticationService>(
      AuthenticationService,
    );
    usersService = await module.get(UsersService);

    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    userData = {
      ...mockedUser,
    };

    findUser = jest.fn().mockResolvedValue(userData);
    const usersRepository = {
      findOne: findUser,
    };
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual('string');
    });
  });

  // describe('when accessing the data of authenticating user', () => {
  //   it('should attempt to get the user by email', async () => {
  //     const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');
  //     await authenticationService.getAuthenticatedUser(
  //       'user@email.com',
  //       'strongPassword',
  //     );
  //     expect(getByEmailSpy).toBeCalledTimes(1);
  //   });
  // });

  describe('when accessing the data of authenticating user', () => {
    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });
      it('should throw an error', async () => {
        await expect(
          authenticationService.getAuthenticatedUser(
            'user@email.com',
            'strongPassword',
          ),
        ).rejects.toThrow();
      });
    });
    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(userData);
        });
        it('should return the user data', async () => {
          const user = await authenticationService.getAuthenticatedUser(
            'user@email.com',
            'strongPassword',
          );
          expect(user).toBe(userData);
        });
      });
      describe('and the user is not found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });
        it('should throw an error', async () => {
          await expect(
            authenticationService.getAuthenticatedUser(
              'user@email.com',
              'strongPassword',
            ),
          ).rejects.toThrow();
        });
      });
    });
  });
});
