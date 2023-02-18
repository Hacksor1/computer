import { BehaviorSubject, tap } from 'rxjs';


const prevState = JSON.parse(localStorage.getItem('cart') || '{}');

export const cartStateSubject = new BehaviorSubject(prevState);
export const cartState$ = cartStateSubject
  .asObservable()
  .pipe(tap(state => {
    localStorage.setItem('cart', JSON.stringify(state))
}));


const prevLoginState = (localStorage.getItem('auth') || 'false');
export const authStateSubject = new BehaviorSubject(prevLoginState);
export const authState$ = authStateSubject
  .asObservable()
  .pipe(tap(state => {
    localStorage.setItem('auth', state)
}));
