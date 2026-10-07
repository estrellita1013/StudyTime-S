import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

interface User { name: string; email: string; hash: string; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private storage: StorageService) {}

  // Cifra la contraseña. Si el navegador no ofrece crypto.subtle (por ejemplo con http://IP),
  // usa una codificación simple solo para la demostración.
  private async hash(text: string) {
    if (!globalThis.crypto?.subtle) return btoa(encodeURIComponent(text));
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Devuelve null si todo salió bien, o el mensaje de error
  async register(name: string, email: string, password: string): Promise<string | null> {
    const users = await this.storage.get<User[]>('users', []);
    const mail = email.trim().toLowerCase();
    if (users.some(u => u.email === mail)) return 'Ese correo ya está registrado';
    users.push({ name: name.trim(), email: mail, hash: await this.hash(password) });
    await this.storage.set('users', users);
    await this.start(mail, name.trim());
    return null;
  }

  async login(email: string, password: string): Promise<string | null> {
    const users = await this.storage.get<User[]>('users', []);
    const mail = email.trim().toLowerCase();
    const h = await this.hash(password);
    const user = users.find(u => u.email === mail && u.hash === h);
    if (!user) return 'Correo o contraseña incorrectos';
    await this.start(mail, user.name);
    return null;
  }

  // Guarda la sesión activa y pone el nombre en el perfil
  private async start(email: string, name: string) {
    await this.storage.set('session', email);
    const p = await this.storage.getProfile();
    await this.storage.saveProfile({ ...p, name });
  }

  async isLogged() { return !!(await this.storage.get<string>('session', '')); }
  async logout() { await this.storage.set('session', ''); }
}