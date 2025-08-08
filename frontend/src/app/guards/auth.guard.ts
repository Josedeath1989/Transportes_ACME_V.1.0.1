import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // Aquí debes agregar la lógica para determinar si el usuario está autenticado
    // y permitir o denegar el acceso a la ruta
    return true;
  }
}