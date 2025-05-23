---
applyTo: '**/*.ts'
---
# Frontend Code Style Guide (TypeScript/Angular)

## 1. General Coding Conventions

### 1.1. Naming Conventions
- **Variables, Functions, Methods:** `camelCase` (e.g., `userName`, `calculateTotal()`).
- **Classes, Interfaces, Enums, Decorators, Type Aliases:** `PascalCase` (e.g., `UserService`, `IUserContract`, `OrderStatus`).
- **Interfaces (Optional but Recommended):** Prefix with `I` (e.g., `IUserProfile`) or suffix with `Contract` (e.g. `UserProfileContract`). Choose one style and be consistent.
- **Angular Specific Suffixes:**
    - Components: `*.component.ts` (e.g., `user-profile.component.ts`) -> Class: `UserProfileComponent`
    - Services: `*.service.ts` (e.g., `auth.service.ts`) -> Class: `AuthService`
    - Modules: `*.module.ts` (e.g., `shared.module.ts`) -> Class: `SharedModule`
    - Directives: `*.directive.ts` (e.g., `highlight.directive.ts`) -> Class: `HighlightDirective`
    - Pipes: `*.pipe.ts` (e.g., `truncate.pipe.ts`) -> Class: `TruncatePipe`
    - Guards: `*.guard.ts` (e.g., `auth.guard.ts`) -> Class: `AuthGuard`
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_LOGIN_ATTEMPTS`).
- **File Names:** Use `kebab-case` for filenames, following the `feature.type.ts` pattern (e.g., `user-list.component.ts`, `auth.service.ts`).

### 1.2. Formatting
- **Indentation:** Use 2 spaces for indentation.
- **Line Length:** Aim for a maximum of 120 characters per line.
- **Semicolons:** Always use semicolons at the end of statements.
- **Braces:** Use braces for all control flow blocks (`if`, `for`, `while`, etc.), even single-line ones.
- **Quotes:** Use single quotes (`'`) for strings, unless double quotes (`"`) are needed (e.g., for JSON, or interpolated strings containing single quotes).
- **Whitespace:** Use whitespace to improve readability (e.g., around operators, after commas).

### 1.3. Imports
- **Organization (Order):**
    1. Angular core imports (e.g., `@angular/core`, `@angular/common`).
    2. Third-party library imports (e.g., `rxjs`, `lodash`).
    3. Application-specific imports (modules, services, components, etc.), ordered by path depth or module.
- **Paths:** Use path aliases (e.g., `@App/*`, `@Shared/*`, `@Features/*`) configured in `tsconfig.json` for cleaner and more maintainable imports across different parts of the application. Avoid long relative paths like `../../../../service`.
- **Named vs. Default Imports:** Prefer named imports for clarity.

### 1.4. Type Safety
- **`strict` mode:** Ensure `strict: true` is enabled in `tsconfig.json`.
- **Avoid `any`:** Use `any` as a last resort. Prefer specific types, `unknown` (and then type check), or generics.
- **Explicit Types:** Use explicit types for function parameters, return types, and public class members. Type inference can be used for local variables if the type is obvious.
- **Readonly:** Use `readonly` for properties that should not be reassigned after initialization.

### 1.5. Comments
- **JSDoc/TSDoc:** Use TSDoc for documenting public APIs (classes, methods, properties).
- **Clarity:** Comment complex logic, workarounds, or important decisions. Avoid commenting obvious code.
- **TODOs:** Use `// TODO:` for tasks to be done, and `// FIXME:` for known issues that need fixing. Include a brief explanation.

## 2. Angular Best Practices

### 2.1. Components
- **Single Responsibility:** Components should primarily focus on presentation logic and user interaction. Delegate complex business logic, data manipulation, and API calls to services.
- **`@Input()` and `@Output()`:**
    - Use `@Input()` to pass data into a component.
    - Use `@Output()` with `EventEmitter` to emit events from a component to its parent. Name event handlers in the parent component as `on<EventName>`.
- **Change Detection:** Prefer `ChangeDetectionStrategy.OnPush` for components, especially presentational ones, to improve performance by reducing change detection cycles.
- **Lifecycle Hooks:** Implement lifecycle hooks in a consistent order as defined by Angular.
- **Accessibility (A11y):** Design components with accessibility in mind (ARIA attributes, keyboard navigation, semantic HTML).

### 2.2. Services
- **Single Responsibility:** Services should encapsulate a specific piece of business logic, data fetching/caching, or shared functionality.
- **Injectable:** Decorate services with `@Injectable()`. Use `providedIn: 'root'` for singleton services that are available application-wide and are tree-shakable. For services specific to a feature module, provide them at the module level or component level if necessary.
- **Error Handling:** Implement robust error handling in services, especially for API calls.

### 2.3. Modules
- **Modularity:** Organize the application into feature modules, a `CoreModule`, and one or more `SharedModule`(s).
    - **`AppModule`:** The root module, primarily for bootstrapping and importing other key modules.
    - **`CoreModule`:** For singleton services and application-wide components (e.g., navbar, footer). Import it ONLY in `AppModule`.
    - **`SharedModule`:** For commonly used components, directives, and pipes that are used across multiple feature modules. Import `SharedModule` into feature modules that need them. Do NOT provide services here.
    - **Feature Modules:** Group related components, services, and routes for a specific feature (e.g., `UserModule`, `ProductModule`). Use lazy loading for feature modules.
- **Lazy Loading:** Implement lazy loading for feature modules to improve initial application load time.

## 3. Design Pattern: Container/Presentational Components

This pattern (also known as Smart/Dumb Components) promotes separation of concerns, reusability, and testability.

- **Container (Smart) Components:**
    - **Responsibilities:**
        - Manage state and data fetching (often by injecting and using services).
        - Handle application logic and side effects.
        - Pass data down to presentational components via `@Input()`.
        - Respond to events emitted by presentational components via `@Output()`.
    - **Characteristics:**
        - Often correspond to a routed component or a significant section of a page.
        - Aware of services and application state.
        - Less reusable across different contexts.

- **Presentational (Dumb) Components:**
    - **Responsibilities:**
        - Display data received via `@Input()`.
        - Emit user interaction events via `@Output()`.
        - Focus solely on the UI and how things look and feel.
    - **Characteristics:**
        - Receive all data via `@Input()` properties.
        - Communicate with the outside world only through `@Output()` events.
        - Do not inject services (except for purely presentational concerns like `FormBuilder` or `ChangeDetectorRef` if absolutely necessary and well-justified).
        - Highly reusable and easier to test in isolation.
        - Often use `ChangeDetectionStrategy.OnPush`.

**Benefits:**
- **Improved Reusability:** Presentational components can be reused across different parts of the application.
- **Better Testability:** Both types of components are easier to test due to their focused responsibilities.
- **Clear Separation of Concerns:** Simplifies understanding and maintaining the codebase.

## 4. SOLID Principles

Adhering to SOLID principles leads to more maintainable, scalable, and robust Angular applications.

- **S - Single Responsibility Principle (SRP):**
    - A class (component, service, etc.) should have one, and only one, reason to change.
    - *Angular Context:* Components handle UI and user interaction; services handle business logic and data access. Avoid components that fetch data AND manage complex state AND render UI.

- **O - Open/Closed Principle (OCP):**
    - Software entities should be open for extension but closed for modification.
    - *Angular Context:* Use Angular's DI for extensibility, create configurable components/directives with `@Input()` properties, leverage structural directives, or use inheritance/composition patterns carefully. For example, custom form validators or HTTP interceptors extend functionality without modifying core Angular code.

- **L - Liskov Substitution Principle (LSP):**
    - Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.
    - *Angular Context:* When using class inheritance (e.g., for base components or services), ensure that derived classes adhere to the contract of the base class. Overridden methods should maintain compatible signatures and behavior.

- **I - Interface Segregation Principle (ISP):**
    - Clients should not be forced to depend on methods they do not use. Prefer smaller, cohesive interfaces over large, monolithic ones.
    - *Angular Context:* Define focused interfaces for component `@Input()` objects, service method parameters, and return types. For example, if a component only needs a user's name and email, its input interface should not include the user's entire address history.

- **D - Dependency Inversion Principle (DIP):**
    - High-level modules should not depend on low-level modules. Both should depend on abstractions (e.g., interfaces or abstract classes). Abstractions should not depend on details; details should depend on abstractions.
    - *Angular Context:* Angular's Dependency Injection (DI) system is a core enabler of DIP. Components and services depend on abstractions (often interfaces or injection tokens) rather than concrete implementations. This allows for easier mocking in tests and swapping implementations.

## 5. Security Practices

### 5.1. API Keys and Sensitive Information
- **Environment Variables:** Never hardcode API keys, secrets, or other sensitive information directly in the source code.
  - Store these values in environment files (`environment.ts`, `environment.development.ts`, etc.)
  - Add these environment files to `.gitignore` to prevent them from being committed to version control
  - Document the required environment variables in README or INSTRUCTIONS files
  - For production deployments, use server-side environment configuration or secure vaults
- **Secret Scanning:** Implement pre-commit hooks or use tools that detect secrets in code before they are committed
- **Access Control:** Apply the principle of least privilege when defining API keys and permissions

### 5.2. Other Security Best Practices
- **Input Validation:** Always validate user input, both on client and server sides
- **HTTPS:** Ensure all API endpoints use HTTPS
- **Content Security Policy:** Implement appropriate Content Security Policy headers
- **Authentication:** Use modern authentication methods (like OAuth 2.0, JWT) and handle tokens securely
- **XSS Prevention:** Sanitize content and use Angular's built-in XSS protection mechanisms

## 6. Linting and Formatting Tools
- **ESLint:** Utilize ESLint with relevant Angular plugins (e.g., `@angular-eslint/eslint-plugin`) for static code analysis to enforce coding standards and catch potential errors early.
- **Prettier:** Employ Prettier for consistent, automated code formatting. Integrate it with your IDE and consider using pre-commit hooks to ensure all committed code adheres to the defined style.
- **Stylelint:** For CSS/SCSS files, use Stylelint to maintain consistent styles.