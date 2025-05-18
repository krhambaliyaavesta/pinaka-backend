import request from 'supertest';
import app from '../../app';
import { generateAuthToken, UserRole } from './authHelpers';

/**
 * Test request helper class for making authenticated API requests
 */
export class TestRequest {
  private token: string | null = null;

  /**
   * Set authentication token for requests
   * @param userId User ID to include in token
   * @param role User role
   * @returns this instance for chaining
   */
  public setAuth(userId: string, role: UserRole): TestRequest {
    this.token = generateAuthToken({ id: userId, role });
    return this;
  }

  /**
   * Make a GET request to the specified endpoint
   * @param url API endpoint URL
   * @returns Supertest request
   */
  public get(url: string) {
    const req = request(app).get(url);
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`);
    }
    return req;
  }

  /**
   * Make a POST request to the specified endpoint
   * @param url API endpoint URL
   * @param data Request body data
   * @returns Supertest request
   */
  public post(url: string, data?: any) {
    const req = request(app).post(url);
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`);
    }
    if (data) {
      req.send(data);
    }
    return req;
  }

  /**
   * Make a PUT request to the specified endpoint
   * @param url API endpoint URL
   * @param data Request body data
   * @returns Supertest request
   */
  public put(url: string, data?: any) {
    const req = request(app).put(url);
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`);
    }
    if (data) {
      req.send(data);
    }
    return req;
  }

  /**
   * Make a DELETE request to the specified endpoint
   * @param url API endpoint URL
   * @returns Supertest request
   */
  public delete(url: string) {
    const req = request(app).delete(url);
    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`);
    }
    return req;
  }
}

/**
 * Create a new test request helper instance
 * @returns TestRequest instance
 */
export const createTestRequest = (): TestRequest => {
  return new TestRequest();
}; 