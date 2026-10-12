/// <reference types="jasmine" />

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StorageService } from '../services/storage.service';
import { NetworkService } from '../services/network.service';

declare const jasmine: any;

@Component({
  selector: 'app-home',
  template: '',
  standalone: true
})
export class HomePage {}

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  const storageServiceMock = {
    getProfile: jasmine.createSpy('getProfile').and.resolveTo({
      name: 'Estudiante',
      goalHours: 2
    }),

    getSessions: jasmine.createSpy('getSessions').and.resolveTo([]),

    getSubjects: jasmine.createSpy('getSubjects').and.resolveTo([]),

    getGoals: jasmine.createSpy('getGoals').and.resolveTo([])
  };

  const networkServiceMock = {
    online$: {
      subscribe: jasmine.createSpy('subscribe').and.callFake(() => ({
        unsubscribe: jasmine.createSpy('unsubscribe')
      }))
    }
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate').and.resolveTo(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        {
          provide: StorageService,
          useValue: storageServiceMock
        },
        {
          provide: NetworkService,
          useValue: networkServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});