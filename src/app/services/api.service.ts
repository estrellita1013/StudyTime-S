import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Tip } from '../models/models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private postUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient, private storage: StorageService) {}

  // GET: consejo del día (API Advice Slip). Si hay internet guarda copia; si falla, usa la última copia
  async getTips(): Promise<Tip[]> {
    try {
      const res = await firstValueFrom(
        this.http.get<{ slip: { id: number; advice: string } }>('https://api.adviceslip.com/advice'),
      );
      const data: Tip[] = [{ id: res.slip.id, title: 'Consejo del día', body: res.slip.advice }];
      await this.storage.set('tips', data);
      return data;
    } catch {
      return this.storage.get<Tip[]>('tips', []);
    }
  }

  // POST: envía un comentario del usuario
  sendFeedback(title: string, body: string) {
    return firstValueFrom(this.http.post(this.postUrl, { title, body, userId: 1 }));
  }
}