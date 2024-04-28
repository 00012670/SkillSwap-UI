import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  constructor() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      this.darkMode = JSON.parse(savedTheme);
      this.applyTheme();
    }
  }
  private darkMode = false;

  isDarkMode() {
    return this.darkMode;
  }

  setDarkMode(isDarkMode: boolean) {
    this.darkMode = isDarkMode;
    // Save the theme mode to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    this.applyTheme();
  }

  private applyTheme() {
    if (this.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

}
