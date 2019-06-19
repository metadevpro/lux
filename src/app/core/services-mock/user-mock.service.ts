import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PaginationInfo } from 'projects/lux/src/lib/core/models/pagination';

const mockUsers: any[] = [
    {
      userName: 'john',
      firstName: 'John',
      lastName: 'Doe',
    },
    {
      userName: 'ziva',
      firstName: 'Ziva',
      lastName: 'Crowther'
    },
    {
      userName: 'nikki',
      firstName: 'Nikki',
      lastName: 'Hollis'
    },
    {
      userName: 'kaleb',
      firstName: 'Kaleb',
      lastName: 'Storey'
    },
    {
      userName: 'miller',
      firstName: 'Miller',
      lastName: 'Lee'
    },
    {
      userName: 'olaf',
      firstName: 'Olaf',
      lastName: 'Ashton'
    },
    {
      userName: 'solomon',
      firstName: 'Solomon',
      lastName: 'Gamble'
    },
    {
      userName: 'adnan',
      firstName: 'Adnan',
      lastName: 'Piper'
    },
    {
      userName: 'donnell',
      firstName: 'Donnell',
      lastName: 'Huff'
    },
    {
      userName: 'lina',
      firstName: 'Lina',
      lastName: 'Herman'
    }

];

@Injectable()
export class UserMockService {

    private list: any[] = mockUsers;
    private seq = 0;

    constructor() { }

    getAll(pagination: PaginationInfo): Observable<any[]> {
        const x1 = (pagination.page - 1) * pagination.limit;
        const x2 = x1 + pagination.limit;
        return of(this.list.slice(x1, x2));
    }

    getCount(): Observable<number> {
      return of(this.list.length);
    }
}
