// import { Test, TestingModule } from '@nestjs/testing';
// import { UserService } from './user.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { User } from '../../common/entities/user.entities';

// import { Repository } from 'typeorm';

// describe('UserService', () => {
//   let service: UserService;
//   let userRepository: Repository<User>;

//   const userData = [
//     { id: 1, name: 'test1', username: 'test11', password: 'dinhtranduc', avatar: '' },
//     { id: 2, name: 'test2', username: 'test12', password: 'dinhtranduc', avatar: '' },
//   ];
//   const newUser= {id: '3', name: 'test3', username: 'test3', password: 'dinhtranduc', avatar: '' }
//   const updateData= {name: 'test3', username: 'test3', password: 'dinhtranduc', avatar: '' }
//   const oldUser= {id: '3', name: 'test33', username: 'test333', password: 'dinhtranduc33', avatar: '' }
//   const updateUser ={...oldUser, ...updateData};
  
//   const mockUserRepository = {
//     find: jest.fn().mockResolvedValue(userData),
//     create: jest.fn(),
//     save: jest.fn(),
//     findOne: jest.fn(),
//     merge: jest.fn()
//   };

//   (mockUserRepository.create as jest.Mock).mockReturnValue(newUser);
//   (mockUserRepository.save as jest.Mock).mockResolvedValue(newUser);


//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UserService,
//         {
//           provide: getRepositoryToken(User),
//           useValue: mockUserRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<UserService>(UserService);
//     userRepository = module.get<Repository<User>>(getRepositoryToken(User));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should return an array', async()=>{
//     const user = await service.getAllUsers();
//     expect(user).toEqual(userData);
//     expect(mockUserRepository.find).toHaveBeenCalled()
//   })

//   it('should return a user by query', async ()=>{
//     const query='test1'
//     const user= await service.getUsers(query);
//     expect(user).toEqual(userData);
//     expect(mockUserRepository.find).toHaveBeenCalledWith({
//       where:[
//         {name: query},
//         {username: query}
//       ]
//     })
//   })

//   it('should return new user', async ()=>{
//     const userData1 = {name: 'test3', username: 'test3', password: 'dinhtranduc', avatar: '' }

//     const user = await service.createUser(userData1);

//     expect(mockUserRepository.create).toHaveBeenCalledWith(userData1);
//     expect(mockUserRepository.save).toHaveBeenCalledWith(newUser);
//     expect(user).toEqual(newUser);
//   })
  
//   it('should not update when user not exits', async()=>{
//     const id =5;

//     (mockUserRepository.findOne as jest.Mock).mockResolvedValueOnce(null)
//     const result= await service.updateUser(id, updateData)

//     expect(mockUserRepository.findOne).toHaveBeenCalledWith({where: {id: id}});
//     expect(mockUserRepository.merge).not.toHaveBeenCalledWith(); // thắc mắc tại sao lại with mới đúng mặc dù được gọi trước
//     expect(mockUserRepository.save).not.toHaveBeenCalledWith();
//     expect(result).toBeNull();
    
//   })
//   it('should update user when user exits', async()=>{
//     const id=3;
//     (mockUserRepository.merge as jest.Mock).mockReturnValue(updateUser);
//     (mockUserRepository.findOne as jest.Mock).mockResolvedValue(oldUser);
//     const result = await service.updateUser(id, updateData)

//     expect(mockUserRepository.findOne).toHaveBeenCalledWith({where: {id: id}})
//     expect(mockUserRepository.merge).toHaveBeenCalledWith(oldUser, updateData)
//     expect(mockUserRepository.save).toHaveBeenCalledWith(updateUser)
//     expect(result).toEqual(updateUser)

//   })

// });
