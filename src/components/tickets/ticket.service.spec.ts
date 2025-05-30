// import { Test , TestingModule} from "@nestjs/testing";
// import { TicketService } from "./ticket.service";
// import { Ticket } from "../../common/entities/ticket.entities";
// import { Repository } from "typeorm";
// import { getRepositoryToken } from "@nestjs/typeorm";
// import { Project } from "../../common/entities/project.entities";
// import { User } from "../../common/entities/user.entities";


// describe('TicketService', ()=>{
//     let service: TicketService;
//     let ticketRepository: Repository<Ticket>
    
//     const mockQueryBuilder = {
//         select: jest.fn().mockReturnThis(),
//         andWhere: jest.fn().mockReturnThis(),
//         getMany: jest.fn(),
//       };

//     const mockTicketRepository= {
//         createQueryBuilder: jest.fn(()=> mockQueryBuilder),
//     }
//     const mockTicket =[
//         {title: 'Ticket1', dealine: '2025-03-18'},
//         {title: 'Ticket2', dealine: '2025-04-18'},
//     ]

//     beforeEach(async ()=>{
//         const module: TestingModule = await Test.createTestingModule({
//         providers: [
//             TicketService,
//             {
//                 provide: getRepositoryToken(Ticket),
//                 useValue: mockTicketRepository,
//             },
//             {
//                 provide: getRepositoryToken(Project),
//                 useValue: {},
//             },
//             {
//                 provide: getRepositoryToken(User),
//                 useValue: {},
//             }
//         ],
//         }).compile();

//         service= module.get<TicketService>(TicketService);
//         ticketRepository= module.get<Repository<Ticket>>(getRepositoryToken(Ticket));
        
//     })


//     it('should be defined', () => {
//         expect(service).toBeDefined();
//       });

//     it('should return ticket by projectID', async ()=>{
//         mockQueryBuilder.getMany.mockResolvedValue(mockTicket)
//         const result = await service.getTicketByProject({projectId: 1})

//         expect(mockTicketRepository.createQueryBuilder).toHaveBeenCalledWith('ticket')
//         expect(mockQueryBuilder.select).toHaveBeenCalledWith(['ticket.title', 'ticket.deadline'])
//         expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('ticket.project.id = :projectId', { projectId: 1 })
//         expect(mockQueryBuilder.getMany).toHaveBeenCalled();
//         expect(result).toEqual(mockTicket);
//     })
//     it('should return ticket by projectDealine', async()=>{
//         mockQueryBuilder.getMany.mockResolvedValue(mockTicket)
//         const result = await service.getTicketByProject({ticketDeadline: '18'})

//         expect(mockTicketRepository.createQueryBuilder).toHaveBeenCalledWith('ticket')
//         expect(mockQueryBuilder.select).toHaveBeenCalledWith(['ticket.title', 'ticket.deadline'])
//         expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('DAY(ticket.deadline) = :ticketDeadline', { ticketDeadline:18 })
//         expect(mockQueryBuilder.getMany).toHaveBeenCalled();
//         expect(result).toEqual(mockTicket);
//     })
//     it('should return ticket by projectID and projectDealine',async ()=>{

//         mockQueryBuilder.getMany.mockResolvedValue(mockTicket)
//         const result = await service.getTicketByProject({projectId: 1,ticketDeadline: '18'})

//         expect(mockTicketRepository.createQueryBuilder).toHaveBeenCalledWith('ticket')
//         expect(mockQueryBuilder.select).toHaveBeenCalledWith(['ticket.title', 'ticket.deadline'])
//         expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('ticket.project.id = :projectId', { projectId: 1 })
//         expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('DAY(ticket.deadline) = :ticketDeadline', { ticketDeadline:18 })
//         expect(mockQueryBuilder.getMany).toHaveBeenCalled();
//         expect(result).toEqual(mockTicket);
//     })
//     it('should return null when no filter', async ()=>{
//         const result = await service.getTicketByProject({})
//         mockQueryBuilder.getMany.mockResolvedValue(null)

//         expect(result).toBeNull();
//     })



    
// })