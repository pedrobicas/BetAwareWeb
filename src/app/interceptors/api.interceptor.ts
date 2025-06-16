import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Garante que a URL começa com /api
  if (!req.url.startsWith('/api')) {
    return next(req);
  }

  // Clona a requisição para não modificar a original
  const clonedReq = req.clone({
    // Mantém a URL original, pois o proxy já está configurado para redirecionar
    url: req.url
  });

  return next(clonedReq);
}; 