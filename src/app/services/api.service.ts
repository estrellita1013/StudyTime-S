import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';

import { Tip } from '../models/models';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private postUrl = 'https://jsonplaceholder.typicode.com/posts';

  private adviceUrl = 'https://api.adviceslip.com/advice';

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  // =========================================
  // CONSEJOS DE RESPALDO
  // =========================================

  private fallbackTips: Tip[] = [
    {
      id: 1,
      title: 'Consejo del día',
      body: 'Organiza tu tiempo y comienza por la tarea más importante.'
    },
    {
      id: 2,
      title: 'Consejo del día',
      body: 'Estudiar un poco cada día es mejor que dejar todo para el último momento.'
    },
    {
      id: 3,
      title: 'Consejo del día',
      body: 'Elimina las distracciones y dedica unos minutos de concentración total a tus estudios.'
    },
    {
      id: 4,
      title: 'Consejo del día',
      body: 'Haz una pausa cuando la necesites. Descansar también forma parte de estudiar bien.'
    },
    {
      id: 5,
      title: 'Consejo del día',
      body: 'Define una meta para cada sesión de estudio y trabaja hasta conseguirla.'
    },
    {
      id: 6,
      title: 'Consejo del día',
      body: 'La constancia convierte pequeños esfuerzos en grandes resultados.'
    }
  ];


  // =========================================
  // CONSEJO DEL DÍA
  // =========================================

  async getTips(): Promise<Tip[]> {

    // Intentar obtener consejo desde Internet
    try {

      const res = await firstValueFrom(
        this.http.get<{
          slip: {
            id: number;
            advice: string;
          };
        }>(this.adviceUrl).pipe(
          timeout(5000)
        )
      );

      if (res?.slip?.advice) {

        const data: Tip[] = [
          {
            id: res.slip.id,
            title: 'Consejo del día',
            body: res.slip.advice
          }
        ];

        // Guardar el último consejo
        await this.storage.set('tips', data);

        return data;
      }

    } catch (error) {

      console.warn(
        'La API no respondió. Utilizando consejo local.',
        error
      );

    }


    // =========================================
    // CONSEJO GUARDADO
    // =========================================

    try {

      const saved = await this.storage.get<Tip[]>('tips', []);

      if (saved.length > 0) {
        return saved;
      }

    } catch (error) {

      console.warn(
        'No se pudo cargar el consejo guardado.',
        error
      );

    }


    // =========================================
    // CONSEJO LOCAL
    // =========================================

    const day = new Date().getDate();

    const index = day % this.fallbackTips.length;

    return [this.fallbackTips[index]];

  }


  // =========================================
  // ENVIAR COMENTARIO
  // =========================================

  sendFeedback(title: string, body: string) {

    return firstValueFrom(
      this.http.post(
        this.postUrl,
        {
          title,
          body,
          userId: 1
        }
      )
    );

  }

}