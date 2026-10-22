# Plantillas de correo de acceso (Supabase) — textos en español, con código

**Para qué:** hoy un cliente nuevo que pide un enlace recibe el correo estándar de Supabase **en inglés, sin marca y sin el código de 8 dígitos** que la pantalla de entrada promete. Estas dos plantillas lo arreglan. Las pega el dueño en Supabase.

**Dónde:** Supabase → tu proyecto *Coparentia* → **Authentication** → **Email Templates** (en algunas versiones: Authentication → Emails → Templates). Hay que editar dos: **Confirm signup** y **Magic Link**. Cada una tiene un campo **Subject** (asunto) y un **Message body** (cuerpo, en HTML).

Las partes entre llaves dobles (`{{ .ConfirmationURL }}`, `{{ .Token }}`) las reemplaza Supabase solas: **no las toques**.

---

## 1) Confirm signup (cuenta nueva sin confirmar)

**Subject:**
```
Confirma tu correo para entrar a Coparentia
```

**Message body:**
```html
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#14233a;line-height:1.55">
  <h2 style="margin:0 0 12px;font-size:22px;color:#14233a">Confirma tu correo</h2>
  <p style="margin:0 0 16px">Hola. Para entrar a tu expediente en Coparentia, confirma que este correo es tuyo.</p>
  <p style="margin:0 0 24px">
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#2f6fdc;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:999px">Confirmar y entrar</a>
  </p>
  <p style="margin:0 0 8px">Si el botón no abre la aplicación, escribe este código en la pantalla de entrada:</p>
  <p style="margin:0 0 24px;font-size:28px;letter-spacing:6px;font-weight:bold;color:#14233a">{{ .Token }}</p>
  <p style="margin:0 0 8px;font-size:13px;color:#5b6b82">Por seguridad, el enlace y el código vencen pronto. Si ya caducaron, entra a coparentia.co/entrar con este mismo correo y te mandamos uno nuevo.</p>
  <p style="margin:0;font-size:13px;color:#5b6b82">Si tú no pediste esto, puedes ignorar este mensaje. ¿Dudas? Escríbenos a soporte@coparentia.co</p>
</div>
```

---

## 2) Magic Link (cuenta que ya existe)

**Subject:**
```
Tu enlace para entrar a Coparentia
```

**Message body:**
```html
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#14233a;line-height:1.55">
  <h2 style="margin:0 0 12px;font-size:22px;color:#14233a">Entra a tu expediente</h2>
  <p style="margin:0 0 16px">Hola. Toca el botón para entrar a Coparentia, sin contraseña.</p>
  <p style="margin:0 0 24px">
    <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#2f6fdc;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 24px;border-radius:999px">Entrar a mi expediente</a>
  </p>
  <p style="margin:0 0 8px">Si el botón no abre la aplicación, escribe este código en la pantalla de entrada:</p>
  <p style="margin:0 0 24px;font-size:28px;letter-spacing:6px;font-weight:bold;color:#14233a">{{ .Token }}</p>
  <p style="margin:0 0 8px;font-size:13px;color:#5b6b82">Por seguridad, el enlace y el código vencen pronto. Si ya caducaron, entra a coparentia.co/entrar con este mismo correo y te mandamos uno nuevo.</p>
  <p style="margin:0;font-size:13px;color:#5b6b82">Si tú no pediste esto, puedes ignorar este mensaje. ¿Dudas? Escríbenos a soporte@coparentia.co</p>
</div>
```

---

## Cómo probar después de pegarlas
1. **Magic Link:** en `coparentia.co/entrar` pide un enlace con un correo que **ya tenga cuenta** (por ejemplo tu correo principal). Debe llegar en español, con el botón y el código.
2. **Confirm signup:** hace falta un correo **que no exista todavía** en el sistema (por ejemplo un alias nuevo `+prueba3`). Al pedir el enlace se crea una cuenta sin confirmar en producción: bórrala después desde Authentication → Users.
3. Verifica que el **código de 8 dígitos** funciona en la pantalla "Confirmar código".

## Si el código no aparece o tiene otra longitud
La longitud del código la define Supabase (Authentication → configuración de correo / OTP). La pantalla de Coparentia dice 8 dígitos: si Supabase está configurado con otra cantidad, hay que igualar las dos.

## Otras plantillas (no urgentes)
Invite user, Change email address, Reset password y Reauthentication: la app hoy no las usa en el recorrido normal, pero conviene traducirlas con el mismo estilo cuando haya tiempo.
