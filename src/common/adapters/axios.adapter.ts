import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { httpAdapter } from '../interfaces/http-adapter-interface';

@Injectable()
export class AxiosAdapter implements httpAdapter {
  private axios: AxiosInstance = axios;

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(`${process.env.BASE_URL}${url}`);
      return data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async post<T>(url: string, body: any): Promise<T> {
    try {
      const { data } = await this.axios.post<T>(`${process.env.BASE_URL}${url}`, body);
      return data;
    } catch (error) {
      throw new Error('This is an error - Check logs');
    }
  }

  async put<T>(url: string, body: any): Promise<T> {
    try {
      const { data } = await this.axios.put<T>(`${process.env.BASE_URL}${url}`, body);
      return data;
    } catch (error) {
      throw new Error('This is an error - Check logs');
    }
  }

  async delete<T>(url: string): Promise<T> {
    try {
      const { data } = await this.axios.delete<T>(`${process.env.BASE_URL}${url}`);
      return data;
    } catch (error) {
      throw new Error('This is an error - Check logs');
    }
  }

  async patch<T>(url: string, body: any): Promise<T> {
    try {
      const { data } = await this.axios.patch<T>(url, body);
      return data;
    } catch (error) {
      throw new Error('This is an error - Check logs');
    }
  }
}
