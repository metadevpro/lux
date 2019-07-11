import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from './user';


const mockUsers: User[] = [
  {
    userName: 'csalas',
    firstName: 'Chanell',
    lastName: 'Salas',
    id: 'a0',
    enabled: true,
    createdAt: new Date(Date.now()),
    modifiedAt: new Date(Date.now()),
    password: '1234',
    role: 'admin'
  },
  {
    userName: 'hrivas',
    firstName: 'Héctor',
    lastName: 'Rivas',
    id: 'a1',
    enabled: true,
    createdAt: new Date(Date.now()),
    modifiedAt: new Date(Date.now()),
    password: '12345',
    role: 'admin'
  },
  {
    userName: 'pjmolina',
    firstName: 'Pedro J.',
    lastName: 'Molina',
    id: 'a2',
    enabled: true,
    createdAt: new Date(Date.now()),
    modifiedAt: new Date(Date.now()),
    password: 'abcd',
    role: 'admin'
  }
];

@Injectable()
export class UserServiceMock {
  private list: User[] = mockUsers;
  private seq = 0;

  constructor() { }
  getAll(criteria: string): Observable<User[]> {
    return of(this.list.filter(
      it => filterByCriteria(it, criteria))
    );
  }
  getById(id: string): Observable<User> {
    const found = this.list.find(u => u.id === id);
    return found
      ? of(found)
      : throwError(new Error('Not found'));
  }
  create(user: User): Observable<User> {
    user.id = 'e' + (this.seq++).toString();
    this.list.push(user);
    return of(user);
  }
  update(user: User): Observable<User> {
    const foundIndex = this.list.findIndex(u => u.id === user.id);
    if (foundIndex === -1) {
      return throwError(new Error('Not found'));
    } else {
      this.list[foundIndex] = user;
      return of(user);
    }
  }
  delete(user: User): Observable<boolean> {
    const foundIndex = this.list.findIndex(u => u.id === user.id);
    if (foundIndex === -1) {
      return throwError(new Error('Not found'));
    } else {
      this.list.splice(foundIndex, 1);
      return of(true);
    }
  }
}
function filterByCriteria(item: User, criteria: string): boolean {
  if (!item) {
    return false;
  }
  if (!criteria) {
    return true;
  }
  const subString = (criteria || '').toLowerCase();
  return (
    (item.userName || '').toLowerCase().includes(subString) ||
    (item.firstName || '').toLowerCase().includes(subString) ||
    (item.lastName || '').toLowerCase().includes(subString) ||
    (item.enabled ? 'yes' : 'no').toLowerCase().includes(subString) ||
    (item.id || '').toLowerCase().includes(subString)
  );
}
