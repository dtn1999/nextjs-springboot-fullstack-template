# TailAdmin Pro - Next.js (v2.0)

[TailAdmin](https://tailadmin.com) is a modern, responsive, and customizable admin dashboard template built using
Tailwind CSS and Next.js. It is designed to help developers build beautiful and functional dashboards quickly and
easily.

## Quick Links

- [✨ Visit Website](https://tailadmin.com)
- [📄 Documentation](https://tailadmin.com/docs)
- [⬇️ Download](https://tailadmin.com/download)
- [🌐 Live Site](https://nextjs-demo.tailadmin.com)

## Installation

### Prerequisites

To get started with TailAdmin, ensure you have the following prerequisites installed and set up:

- Node.js 18.x or later (recommended to use Node.js 20.x or later)

### Getting Started

1. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   ```

   > Some included packages causes peer-deps issue with React 19 while installing.
   >
   > With npm the `--legacy-peer-deps` flag is a workaround for that at the moment.

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Changelog

### v2.0.0 (February 2025)

A major update focused on Next.js 15 implementation and comprehensive redesign.

#### Major Improvements

- Complete redesign using Next.js 15 App Router and React Server Components
- Enhanced user interface with Next.js-optimized components
- Improved responsiveness and accessibility
- New features including collapsible sidebar, chat screens, and calendar
- Redesigned authentication using Next.js App Router and server actions
- Updated data visualization using ApexCharts for React

#### Breaking Changes

- Migrated from Next.js 14 to Next.js 15
- Chart components now use ApexCharts for React
- Authentication flow updated to use Server Actions and middleware

#### Breaking Changes

- Migrated from Next.js 14 to Next.js 15
- Chart components now use ApexCharts for React
- Authentication flow updated to use Server Actions and middleware

[Read more](https://tailadmin.com/docs/update-logs/nextjs) on this release.

### v1.3.4 (July 01, 2024)

- Fixed JSvectormap rendering issues

### v1.3.3 (June 20, 2024)

- Fixed build error related to Loader component

### v1.3.2 (June 19, 2024)

- Added ClickOutside component for dropdown menus
- Refactored sidebar components
- Updated Jsvectormap package

### v1.3.1 (Feb 12, 2024)

- Fixed layout naming consistency
- Updated styles

### v1.3.0 (Feb 05, 2024)

- Upgraded to Next.js 14
- Added Flatpickr integration
- Improved form elements
- Enhanced multiselect functionality
- Added default layout component

## License

Refer to our [LICENSE](https://tailadmin.com/license) page for more information.
https://github.com/47ng/nuqs
