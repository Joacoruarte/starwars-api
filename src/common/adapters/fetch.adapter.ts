import { httpAdapter } from '../interfaces/http-adapter-interface';

export class FetchAdapter implements httpAdapter {
  async get<T>(url: string) {
    const response = await fetch(url);
    const data: T = await response.json();
    return data;
  }

  async post<T>(url: string, body: any) {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: T = await response.json();
    return data;
  }

  async put<T>(url: string, body: any) {
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data: T = await response.json();
    return data;
  }

  async delete<T>(url: string) {
    const response = await fetch(url, {
      method: 'DELETE',
    });
    const data: T = await response.json();
    return data;
  }
}
