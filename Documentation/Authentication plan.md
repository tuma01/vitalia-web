Plan de Flujo de Autenticación con Temas por Tenant
Resumen Ejecutivo
Este documento describe el flujo completo de autenticación para la aplicación Vitalia, incluyendo:

Autenticación diferenciada por roles (SUPER_ADMIN, TENANT_ADMIN, Doctor, Nurse, Patient)
Carga dinámica de temas personalizados por Tenant
Integración frontend-backend para aplicar temas en Angular
1. Arquitectura Actual del Backend
1.1 Estructura de Autenticación
Tu backend ya tiene implementado:

✅ AuthenticationController
   └─ POST /auth/authenticate
      └─ Retorna: AuthenticationResponse {
            tokens: TokenPairDto (accessToken, refreshToken)
            user: UserSummaryDto (id, email, tenantCode, roles, personType)
         }
✅ ThemeController
   └─ GET /tenants/{tenantCode}/theme
      └─ Retorna: ThemeDTO (colores, logos, fuentes, etc.)
   └─ GET /tenants/config (con header X-Tenant-ID)
      └─ Retorna: ThemeDTO
1.2 Entidades Clave
Tenant (Hospital/Clínica)

code: Identificador único (ej: "HOSPITAL_CENTRAL")
name: Nombre del hospital
theme: Relación OneToOne con Theme
Theme (Configuración visual)

primaryColor, secondaryColor, accentColor
logoUrl, faviconUrl
fontFamily
themeMode: LIGHT | DARK | AUTO
customCss: CSS personalizado
User (Usuario del sistema)

email, password
personId: Referencia a Doctor/Nurse/Patient
UserTenantRole (Relación User-Tenant-Roles)

Un usuario puede tener diferentes roles en diferentes tenants
2. Flujos de Autenticación por Rol
2.1 SUPER_ADMIN (Administrador Global)
IMPORTANT

El SUPER_ADMIN puede acceder a TODOS los tenants y gestionar la plataforma completa.

Características:

✅ No requiere especificar tenantCode en el login
✅ Automáticamente se asigna al tenant GLOBAL
✅ Puede cambiar de tenant después del login
✅ Acceso a panel de administración global
Flujo de Login:

Database
Backend
Frontend
Usuario SUPER_ADMIN
Database
Backend
Frontend
Usuario SUPER_ADMIN
Ingresa email + password
POST /auth/authenticate
{email, password, tenantCode: null}
Buscar usuario por email
User encontrado
Detectar rol SUPER_ADMIN
Asignar tenant = "GLOBAL"
Generar JWT con roles
AuthenticationResponse
{tokens, user: {tenantCode: "GLOBAL", roles: ["ROLE_SUPER_ADMIN"]}}
Guardar tokens en localStorage
Aplicar tema por defecto (sin tenant específico)
Redirigir a /admin/dashboard
Endpoint:

POST /auth/authenticate
Content-Type: application/json
{
  "email": "superadmin@vitalia.com",
  "password": "securePassword"
  // tenantCode: null o ausente
}
Respuesta:

{
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "user": {
    "id": 1,
    "email": "superadmin@vitalia.com",
    "personName": "Super Admin",
    "tenantCode": "GLOBAL",
    "personType": null,
    "roles": ["ROLE_SUPER_ADMIN"],
    "enabled": true
  }
}
2.2 TENANT_ADMIN (Administrador de Hospital)
IMPORTANT

El TENANT_ADMIN gestiona UN hospital específico y debe especificar el tenantCode.

Características:

⚠️ DEBE especificar tenantCode en el login
✅ Acceso completo a su tenant
✅ Puede gestionar usuarios, doctores, enfermeras del hospital
✅ Puede personalizar el tema del hospital
Flujo de Login:

Database
Backend
Frontend (Login)
Usuario TENANT_ADMIN
Database
Backend
Frontend (Login)
Usuario TENANT_ADMIN
Selecciona tenant + ingresa credenciales
POST /auth/authenticate
{email, password, tenantCode: "HOSPITAL_CENTRAL"}
Buscar usuario por email
User encontrado
Validar acceso al tenant
UserAccount encontrado
Obtener roles en tenant
["ROLE_ADMIN"]
Generar JWT
AuthenticationResponse
{tokens, user: {tenantCode: "HOSPITAL_CENTRAL", roles: ["ROLE_ADMIN"]}}
GET /tenants/HOSPITAL_CENTRAL/theme
Cargar Theme del tenant
ThemeDTO
ThemeDTO {primaryColor, logoUrl, ...}
Aplicar tema personalizado
Guardar tokens + theme en localStorage
Redirigir a /admin/hospital-dashboard
Endpoint:

POST /auth/authenticate
Content-Type: application/json
{
  "email": "admin@hospitalcentral.com",
  "password": "securePassword",
  "tenantCode": "HOSPITAL_CENTRAL"
}
Respuesta:

{
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "user": {
    "id": 2,
    "email": "admin@hospitalcentral.com",
    "personName": "Juan Pérez",
    "tenantCode": "HOSPITAL_CENTRAL",
    "personType": null,
    "roles": ["ROLE_ADMIN"],
    "enabled": true
  }
}
Luego cargar tema:

GET /tenants/HOSPITAL_CENTRAL/theme
Respuesta:

{
  "id": 1,
  "name": "Hospital Central Theme",
  "logoUrl": "https://storage.vitalia.com/logos/hospital-central.png",
  "faviconUrl": "https://storage.vitalia.com/favicons/hospital-central.ico",
  "primaryColor": "#1976d2",
  "accentColor": "#ff4081",
  "warnColor": "#f44336",
  "secondaryColor": "#424242",
  "backgroundColor": "#fafafa",
  "textColor": "#212121",
  "linkColor": "#1976d2",
  "buttonTextColor": "#ffffff",
  "fontFamily": "Roboto, sans-serif",
  "themeMode": "LIGHT"
}
2.3 Doctor / Nurse (Personal Médico)
NOTE

Doctores y enfermeras pertenecen a UN tenant específico y tienen roles limitados.

Características:

⚠️ DEBE especificar tenantCode en el login
✅ Acceso a funcionalidades médicas (pacientes, citas, historias clínicas)
✅ Tema personalizado del hospital aplicado automáticamente
Flujo de Login:

Database
Backend
Frontend
Doctor/Nurse
Database
Backend
Frontend
Doctor/Nurse
Selecciona "Doctor" + ingresa credenciales
POST /auth/authenticate
{email, password, tenantCode: "HOSPITAL_CENTRAL"}
Buscar usuario
User encontrado
Validar UserAccount en tenant
UserAccount válido
Obtener roles
["ROLE_DOCTOR"] o ["ROLE_NURSE"]
AuthenticationResponse
GET /tenants/HOSPITAL_CENTRAL/theme
ThemeDTO
Aplicar tema del hospital
Redirigir a /doctor/dashboard o /nurse/dashboard
Endpoint:

POST /auth/authenticate
Content-Type: application/json
{
  "email": "doctor.smith@hospitalcentral.com",
  "password": "securePassword",
  "tenantCode": "HOSPITAL_CENTRAL"
}
Respuesta:

{
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "user": {
    "id": 5,
    "email": "doctor.smith@hospitalcentral.com",
    "personName": "Dr. John Smith",
    "tenantCode": "HOSPITAL_CENTRAL",
    "personType": "DOCTOR",
    "roles": ["ROLE_DOCTOR"],
    "enabled": true
  }
}
2.4 Patient (Paciente)
NOTE

Los pacientes pueden registrarse públicamente y acceder a su portal de paciente.

Características:

⚠️ DEBE especificar tenantCode en el login
✅ Acceso limitado a su información médica
✅ Puede agendar citas, ver resultados
✅ Tema del hospital aplicado
Flujo de Login:

Database
Backend
Frontend
Paciente
Database
Backend
Frontend
Paciente
Selecciona "Patient" + ingresa credenciales
POST /auth/authenticate
{email, password, tenantCode: "HOSPITAL_CENTRAL"}
Buscar usuario
User encontrado
Validar acceso al tenant
UserAccount válido
Obtener roles
["ROLE_PATIENT"]
AuthenticationResponse
GET /tenants/HOSPITAL_CENTRAL/theme
ThemeDTO
Aplicar tema del hospital
Redirigir a /patient/portal
3. Integración Frontend - Carga de Temas
3.1 Flujo de Inicialización del Tema
⚠️ Failed to render Mermaid diagram: Parse error on line 5
flowchart TD
    A[Usuario hace login] --> B{Rol del usuario}
    B -->|SUPER_ADMIN| C[Aplicar tema por defecto<br/>tenantCode: GLOBAL]
    B -->|TENANT_ADMIN<br/>DOCTOR<br/>NURSE<br/>PATIENT| D[Obtener tenantCode<br/>del AuthenticationResponse]
    D --> E[GET /tenants/{tenantCode}/theme]
    E --> F[Recibir ThemeDTO]
    F --> G[Aplicar colores CSS dinámicamente]
    G --> H[Actualizar logo y favicon]
    H --> I[Guardar tema en localStorage]
    I --> J[Aplicar tema en toda la app]
    C --> J
3.2 Implementación en Angular
Paso 1: Crear AuthService

// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
export interface AuthenticationRequest {
  email: string;
  password: string;
  tenantCode?: string;
}
export interface AuthenticationResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: number;
    email: string;
    personName: string;
    tenantCode: string;
    personType: string;
    roles: string[];
    enabled: boolean;
  };
}
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/v1';
  
  constructor(private http: HttpClient) {}
  
  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(
      `${this.API_URL}/auth/authenticate`,
      request
    ).pipe(
      tap(response => {
        // Guardar tokens
        localStorage.setItem('accessToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }
  
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tenantTheme');
  }
  
  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}
Paso 2: Crear TenantThemeService

// src/app/core/services/tenant-theme.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
export interface ThemeDTO {
  id: number;
  name: string;
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  warnColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  linkColor: string;
  buttonTextColor: string;
  fontFamily: string;
  themeMode: 'LIGHT' | 'DARK' | 'AUTO';
  propertiesJson?: string;
}
@Injectable({ providedIn: 'root' })
export class TenantThemeService {
  private readonly API_URL = 'http://localhost:8080/api/v1';
  
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  loadThemeForTenant(tenantCode: string): Observable<ThemeDTO> {
    return this.http.get<ThemeDTO>(
      `${this.API_URL}/tenants/${tenantCode}/theme`
    ).pipe(
      tap(theme => this.applyTheme(theme))
    );
  }
  
  applyTheme(theme: ThemeDTO): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Guardar tema en localStorage
    localStorage.setItem('tenantTheme', JSON.stringify(theme));
    
    // Aplicar CSS variables
    const root = this.document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--warn-color', theme.warnColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--link-color', theme.linkColor);
    root.style.setProperty('--button-text-color', theme.buttonTextColor);
    root.style.setProperty('--font-family', theme.fontFamily);
    
    // Actualizar logo
    const logoElements = this.document.querySelectorAll('.tenant-logo');
    logoElements.forEach(el => {
      (el as HTMLImageElement).src = theme.logoUrl;
    });
    
    // Actualizar favicon
    const favicon = this.document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon && theme.faviconUrl) {
      favicon.href = theme.faviconUrl;
    }
    
    // Aplicar clase de tema (light/dark)
    this.document.body.classList.remove('theme-light', 'theme-dark');
    this.document.body.classList.add(`theme-${theme.themeMode.toLowerCase()}`);
  }
  
  getSavedTheme(): ThemeDTO | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const saved = localStorage.getItem('tenantTheme');
    return saved ? JSON.parse(saved) : null;
  }
}
Paso 3: Modificar APP_INITIALIZER

// src/app/app.config.ts
import { APP_INITIALIZER } from '@angular/core';
import { TenantThemeService } from './core/services/tenant-theme.service';
import { AuthService } from './core/services/auth.service';
export function initializeTheme(
  themeService: TenantThemeService,
  authService: AuthService
) {
  return () => {
    const user = authService.getCurrentUser();
    if (user && user.tenantCode && user.tenantCode !== 'GLOBAL') {
      return themeService.loadThemeForTenant(user.tenantCode).toPromise();
    }
    return Promise.resolve();
  };
}
export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [TenantThemeService, AuthService],
      multi: true
    }
  ]
};
4. Diseño de la Página de Login
4.1 Características de la UI
Basado en la imagen proporcionada, la página de login debe incluir:

✅ Selector de Rol (Admin, Doctor, Patient)

Botones tipo pill con colores distintivos
Verde para Admin
Naranja para Doctor
Azul para Patient
✅ Formulario de Login

Campo Username/Email
Campo Password con toggle show/hide
Checkbox "Remember me"
Link "Forgot Password?"
Botón "Login" con gradiente
✅ Opciones Adicionales

Link "Sign up" para nuevos usuarios
Social login (Google, Facebook, Apple) - opcional
✅ Diseño Visual

Split screen: formulario a la izquierda, ilustración a la derecha
Ilustración decorativa (puede ser generada con IA)
Diseño responsive
4.2 Lógica de Selección de Tenant
// Componente de Login
export class LoginComponent {
  selectedRole: 'admin' | 'doctor' | 'patient' = 'patient';
  tenantCode: string = '';
  
  onRoleSelect(role: string) {
    this.selectedRole = role as any;
    
    // Si es admin o doctor, mostrar selector de tenant
    if (role === 'admin' || role === 'doctor') {
      this.showTenantSelector = true;
    } else {
      this.showTenantSelector = false;
    }
  }
  
  onLogin() {
    const request: AuthenticationRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      tenantCode: this.selectedRole === 'admin' || this.selectedRole === 'doctor' 
        ? this.tenantCode 
        : undefined
    };
    
    this.authService.login(request).subscribe({
      next: (response) => {
        // Cargar tema si no es SUPER_ADMIN
        if (response.user.tenantCode !== 'GLOBAL') {
          this.tenantThemeService.loadThemeForTenant(response.user.tenantCode)
            .subscribe(() => {
              this.navigateBasedOnRole(response.user.roles);
            });
        } else {
          this.navigateBasedOnRole(response.user.roles);
        }
      },
      error: (error) => {
        // Manejar error
      }
    });
  }
  
  private navigateBasedOnRole(roles: string[]) {
    if (roles.includes('ROLE_SUPER_ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin/hospital-dashboard']);
    } else if (roles.includes('ROLE_DOCTOR')) {
      this.router.navigate(['/doctor/dashboard']);
    } else if (roles.includes('ROLE_NURSE')) {
      this.router.navigate(['/nurse/dashboard']);
    } else if (roles.includes('ROLE_PATIENT')) {
      this.router.navigate(['/patient/portal']);
    }
  }
}
5. Mejoras Recomendadas al Backend
5.1 Incluir Theme en AuthenticationResponse
WARNING

Actualmente el frontend debe hacer 2 llamadas: login + obtener tema. Esto puede optimizarse.

Modificación sugerida:

// AuthenticationResponse.java
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private TokenPairDto tokens;
    private UserSummaryDto user;
    private ThemeDTO theme; // 🆕 NUEVO: incluir tema directamente
}
Modificar buildAuthenticationResponse():

private AuthenticationResponse buildAuthenticationResponse(
    User user, UserAccount account, Tenant tenant, List<String> roles
) {
    // ... código existente ...
    
    // 🆕 Cargar tema del tenant
    ThemeDTO themeDTO = null;
    if (tenant.getTheme() != null) {
        themeDTO = themeMapper.toDto(tenant.getTheme());
    }
    
    return AuthenticationResponse.builder()
        .tokens(tokenPair)
        .user(summary)
        .theme(themeDTO) // 🆕 Incluir tema
        .build();
}
Beneficio: El frontend recibe todo en una sola llamada.

5.2 Endpoint Público para Tema (Pre-Login)
Para mostrar el tema ANTES del login (ej: en la página de login misma):

// ThemeController.java
@GetMapping("/public/tenants/{tenantCode}/theme")
public ResponseEntity<ThemeDTO> getPublicTheme(@PathVariable String tenantCode) {
    ThemeDTO dto = themeService.getThemeForTenant(tenantCode);
    return ResponseEntity.ok(dto);
}
Esto permite que la página de login ya muestre el logo y colores del hospital.

6. Resumen de Endpoints
Endpoint	Método	Autenticación	Descripción
/auth/authenticate	POST	No	Login de usuario
/auth/register	POST	No	Registro de paciente
/auth/refresh	POST	No	Renovar access token
/tenants/{code}/theme	GET	Sí	Obtener tema del tenant
/public/tenants/{code}/theme	GET	No	Obtener tema (público)
/tenants/{code}/theme	PUT	Sí (ADMIN)	Actualizar tema
/tenants/{code}/theme/logo	POST	Sí (ADMIN)	Subir logo
7. Tabla de Roles y Permisos
Rol	Tenant Requerido	Puede Cambiar Tenant	Permisos Principales
SUPER_ADMIN	No (usa GLOBAL)	✅ Sí	Gestión completa de plataforma
TENANT_ADMIN	✅ Sí	❌ No	Gestión del hospital
DOCTOR	✅ Sí	❌ No	Gestión de pacientes y citas
NURSE	✅ Sí	❌ No	Asistencia médica
PATIENT	✅ Sí	❌ No	Ver su información médica
8. Diseño de la Página de Login
8.1 Mockup Visual
He creado un diseño de la página de login basado en la imagen de referencia que proporcionaste:

Vitalia Login Page Design
Review
Vitalia Login Page Design

8.2 Características del Diseño
Layout:

✅ Split-screen design (50/50)
✅ Formulario a la izquierda, ilustración a la derecha
✅ Diseño responsive (en móvil, solo se muestra el formulario)
Elementos del Formulario:

Header: "Sign in" con subtítulo
Role Selector: 3 botones pill (Admin verde, Doctor naranja, Patient azul)
Campos de entrada:
Username/Email con label
Password con toggle show/hide
Opciones:
Checkbox "Remember me"
Link "Forgot Password?"
Botón Login: Gradiente morado/púrpura
Footer: Link "Sign up" + iconos de social login
Colores sugeridos:

--admin-color: #4caf50;      /* Verde */
--doctor-color: #ff9800;     /* Naranja */
--patient-color: #2196f3;    /* Azul */
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
8.3 Implementación HTML/Angular
<!-- login.component.html -->
<div class="login-container">
  <div class="login-form-section">
    <div class="form-wrapper">
      <h1>Sign in</h1>
      <p class="subtitle">Enter your credentials to log in</p>
      
      <!-- Role Selector -->
      <div class="role-selector">
        <button 
          class="role-btn admin" 
          [class.active]="selectedRole === 'admin'"
          (click)="selectRole('admin')">
          Admin
        </button>
        <button 
          class="role-btn doctor" 
          [class.active]="selectedRole === 'doctor'"
          (click)="selectRole('doctor')">
          Doctor
        </button>
        <button 
          class="role-btn patient" 
          [class.active]="selectedRole === 'patient'"
          (click)="selectRole('patient')">
          Patient
        </button>
      </div>
      
      <!-- Tenant Selector (solo para admin/doctor) -->
      <div class="form-group" *ngIf="showTenantSelector">
        <label for="tenant">Hospital/Clinic*</label>
        <select id="tenant" [(ngModel)]="tenantCode" required>
          <option value="">Select your hospital</option>
          <option value="HOSPITAL_CENTRAL">Hospital Central</option>
          <option value="CLINICA_SAN_JOSE">Clínica San José</option>
        </select>
      </div>
      
      <!-- Login Form -->
      <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
        <div class="form-group">
          <label for="username">Username*</label>
          <input 
            id="username" 
            type="text" 
            formControlName="email"
            placeholder="Enter your email"
            required>
        </div>
        
        <div class="form-group">
          <label for="password">Password*</label>
          <div class="password-input">
            <input 
              id="password" 
              [type]="showPassword ? 'text' : 'password'" 
              formControlName="password"
              placeholder="Enter your password"
              required>
            <button 
              type="button" 
              class="toggle-password"
              (click)="showPassword = !showPassword">
              <i [class]="showPassword ? 'icon-eye-off' : 'icon-eye'"></i>
            </button>
          </div>
        </div>
        
        <div class="form-options">
          <label class="checkbox">
            <input type="checkbox" formControlName="rememberMe">
            <span>Remember me</span>
          </label>
          <a routerLink="/forgot-password" class="forgot-link">Forgot Password?</a>
        </div>
        
        <button type="submit" class="btn-login" [disabled]="loginForm.invalid">
          Login
        </button>
      </form>
      
      <p class="signup-link">
        Don't have an account? <a routerLink="/register">Sign up</a>
      </p>
      
      <div class="social-login">
        <button class="social-btn google"><i class="icon-google"></i></button>
        <button class="social-btn facebook"><i class="icon-facebook"></i></button>
        <button class="social-btn apple"><i class="icon-apple"></i></button>
      </div>
    </div>
  </div>
  
  <div class="illustration-section">
    <div class="illustration">
      <!-- Ilustración decorativa (puede ser SVG o imagen) -->
      <img src="assets/images/login-illustration.svg" alt="Medical illustration">
    </div>
  </div>
</div>
8.4 Estilos SCSS
// login.component.scss
.login-container {
  display: flex;
  min-height: 100vh;
  
  .login-form-section {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: #ffffff;
    
    .form-wrapper {
      width: 100%;
      max-width: 400px;
    }
    
    h1 {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #212121;
    }
    
    .subtitle {
      color: #757575;
      margin-bottom: 2rem;
    }
  }
  
  .role-selector {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    
    .role-btn {
      flex: 1;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 25px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      color: white;
      
      &.admin {
        background: #4caf50;
        &:hover { background: #45a049; }
        &.active { box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4); }
      }
      
      &.doctor {
        background: #ff9800;
        &:hover { background: #fb8c00; }
        &.active { box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4); }
      }
      
      &.patient {
        background: #2196f3;
        &:hover { background: #1e88e5; }
        &.active { box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4); }
      }
    }
  }
  
  .form-group {
    margin-bottom: 1.25rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #424242;
      font-weight: 500;
    }
    
    input, select {
      width: 100%;
      padding: 0.875rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
      
      &:focus {
        outline: none;
        border-color: #667eea;
      }
    }
    
    .password-input {
      position: relative;
      
      .toggle-password {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #757575;
      }
    }
  }
  
  .form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    .checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    
    .forgot-link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .btn-login {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  .signup-link {
    text-align: center;
    margin: 1.5rem 0;
    color: #757575;
    
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  .social-login {
    display: flex;
    justify-content: center;
    gap: 1rem;
    
    .social-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 1px solid #e0e0e0;
      background: white;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: #f5f5f5;
        transform: translateY(-2px);
      }
    }
  }
  
  .illustration-section {
    flex: 1;
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    
    .illustration {
      max-width: 80%;
      
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    
    .illustration-section {
      display: none;
    }
  }
}
9. Próximos Pasos
✅ Revisar este documento y validar el flujo
🔨 Implementar mejoras en backend (opcional: incluir theme en AuthenticationResponse)
🎨 Diseñar y crear página de login en Angular
🔧 Implementar servicios de autenticación y tema en frontend
🧪 Probar flujos de autenticación para cada rol
📱 Implementar guards y redirecciones basadas en roles
Conclusión
Este plan proporciona un flujo completo de autenticación multi-tenant con temas personalizados. El sistema ya está bien estructurado en el backend, solo requiere algunas mejoras opcionales y la implementación completa en el frontend Angular.