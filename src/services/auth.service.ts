import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_ID_KEY = 'logged_in_user_id';

  // Method to set the logged-in user id
  setLoggedInUserId(userId: number): void {
    localStorage.setItem(this.USER_ID_KEY, userId.toString());
  }

  // Method to check if a user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_ID_KEY);
  }

  // Method to get the logged-in user
  getLoggedInUserId(): number | null {
    const storedUserId = localStorage.getItem(this.USER_ID_KEY);
    return storedUserId ? +storedUserId : null;
  }

  //logout method
  logout(): void {
    localStorage.removeItem(this.USER_ID_KEY);
  }
}