// SERVICE WORKER — notificaciones push (2026-09-28). Es el único código que puede mostrar un
// aviso en el teléfono con la app CERRADA — corre por fuera de la pestaña del navegador. Solo
// hace dos cosas: mostrar el aviso que llega, y llevar al usuario a la app si le da clic.
// No cachea nada de la app (Coparentia no es offline-first); si algún día se agrega eso, va aquí.

self.addEventListener('push', (event) => {
  let datos = { titulo: 'Coparentia', cuerpo: 'Tienes una novedad en tu expediente.', url: '/inicio' };
  try {
    if (event.data) datos = { ...datos, ...event.data.json() };
  } catch {
    // Si el aviso no trae JSON válido, se muestra el genérico de arriba en vez de fallar en silencio.
  }

  event.waitUntil(
    self.registration.showNotification(datos.titulo, {
      body: datos.cuerpo,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: datos.url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/inicio';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((listaVentanas) => {
      // Si la app ya está abierta en una pestaña, la enfoca en vez de abrir una nueva.
      for (const ventana of listaVentanas) {
        if (ventana.url.includes(self.location.origin) && 'focus' in ventana) {
          ventana.navigate(url);
          return ventana.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
