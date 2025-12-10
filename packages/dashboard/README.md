# Dashboard Application

This is mini app for handling business management flow. Dashboard exposes `MainNavigator`. `MainNavigator` is Dashboard app itself. Dashboard app uses auth logic and UI (`SignInScreen`, `AccountScreen`) from Auth remote module, so we suggest to run Auth dev server to prevent issues with Dashboard app. If Auth dev server will no be run, Dashboard app will not work as standalone app.

## Setup

Install dependencies for all apps in root directory of this monorepo:

```
pnpm install
```

### Run

Dashboard no longer ships native projects or standalone runners. Run its dev server as a remote for the Host app:

```
pnpm start
```

This will start the Metro server on port `9002` consumed by the Host via Module Federation. Keep the Auth dev server running (port `9003`) so Dashboard can use Auth screens.
