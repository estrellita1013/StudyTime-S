import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnail: string;
}

interface YouTubeSearchResponse {
  items: Array<{
    id: {
      kind: string;
      videoId?: string;
    };
    snippet: {
      title: string;
      description: string;
      channelTitle: string;
      publishedAt: string;
      thumbnails: {
        medium?: {
          url: string;
        };
        high?: {
          url: string;
        };
      };
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class YouTubeService {

  private readonly apiUrl =
    'https://www.googleapis.com/youtube/v3/search';

  // ==========================================
  // COLOCA AQUÍ TU NUEVA API KEY
  // ==========================================

  private readonly apiKey =
    'AIzaSyACgau7enamMiOjXIt7_SU0xHFsBLnjBYQ';

  constructor(
    private http: HttpClient
  ) {}

  async buscarVideos(
    texto: string
  ): Promise<YouTubeVideo[]> {

    const termino = texto.trim();

    if (!termino) {
      return [];
    }

    const params = new HttpParams()
      .set('part', 'snippet')
      .set('q', termino)
      .set('type', 'video')
      .set('maxResults', '10')
      .set('regionCode', 'DO')
      .set('relevanceLanguage', 'es')
      .set('safeSearch', 'moderate')
      .set('key', this.apiKey);

    try {

      const respuesta =
        await firstValueFrom(
          this.http.get<YouTubeSearchResponse>(
            this.apiUrl,
            { params }
          )
        );

      if (!respuesta.items) {
        return [];
      }

      return respuesta.items
        .filter(
          item => !!item.id?.videoId
        )
        .map(item => ({
          videoId: item.id.videoId!,
          title: this.limpiarTexto(
            item.snippet.title
          ),
          description:
            this.limpiarTexto(
              item.snippet.description
            ),
          channelTitle:
            this.limpiarTexto(
              item.snippet.channelTitle
            ),
          publishedAt:
            item.snippet.publishedAt,
          thumbnail:
            item.snippet.thumbnails.high?.url ??
            item.snippet.thumbnails.medium?.url ??
            ''
        }));

    } catch (error: any) {

      console.error(
        '========== ERROR YOUTUBE =========='
      );

      console.error(
        'Status:',
        error?.status
      );

      console.error(
        'Mensaje:',
        error?.message
      );

      console.error(
        'Respuesta:',
        error?.error
      );

      console.error(
        '===================================='
      );

      throw error;
    }
  }

  getVideoUrl(
    videoId: string
  ): string {

    return `https://www.youtube.com/watch?v=${videoId}`;

  }

  getEmbedUrl(
    videoId: string
  ): string {

    return `https://www.youtube.com/embed/${videoId}`;

  }

  private limpiarTexto(
    texto: string
  ): string {

    return texto
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

  }

}