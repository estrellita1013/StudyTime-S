import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface JamendoTrack {
  id: string;
  name: string;
  artistName: string;
  albumName: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
}

interface JamendoResponse {
  results: Array<{
    id: string;
    name: string;
    duration: number;
    artist_name: string;
    album_name?: string;
    audio?: string;
    audiodownload?: string;
    album_image?: string;
    image?: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class JamendoService {

  private readonly apiUrl =
    'https://api.jamendo.com/v3.0/tracks/';

  /*
   * PEGA AQUÍ TU CLIENT ID DE JAMENDO
   */
  private readonly clientId = 'PEGA_AQUI_TU_CLIENT_ID';

  constructor(private http: HttpClient) {}

  async buscarAudios(texto: string): Promise<JamendoTrack[]> {

    const termino = texto.trim();

    if (!termino) {
      return [];
    }

    const params = new HttpParams()
      .set('client_id', this.clientId)
      .set('format', 'json')
      .set('limit', '20')
      .set('search', termino)
      .set('audioformat', 'mp32')
      .set('include', 'musicinfo')
      .set('imagesize', '300');

    try {

      const respuesta =
        await firstValueFrom(
          this.http.get<JamendoResponse>(
            this.apiUrl,
            { params }
          )
        );

      if (!respuesta?.results) {
        return [];
      }

      return respuesta.results
        .filter(track =>
          !!track.audio ||
          !!track.audiodownload
        )
        .map(track => ({
          id: track.id,
          name: this.limpiarTexto(track.name),
          artistName: this.limpiarTexto(track.artist_name),
          albumName: this.limpiarTexto(
            track.album_name || 'Sin álbum'
          ),
          duration: track.duration || 0,

          audioUrl:
            track.audio ||
            track.audiodownload ||
            '',

          imageUrl:
            track.album_image ||
            track.image ||
            ''
        }));

    } catch (error: any) {

      console.error('========== ERROR JAMENDO ==========');
      console.error('Status:', error?.status);
      console.error('Mensaje:', error?.message);
      console.error('Respuesta:', error?.error);
      console.error('===================================');

      throw error;
    }
  }

  private limpiarTexto(texto: string): string {

    return texto
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
}