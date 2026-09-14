# Version 1.0.0.35 Launched

4th October 2025

**Theme & UI Enhancements**

1. Upgraded to **Tailwind CSS v4.1.14** and **DaisyUI v5.1.27**
   * Migrated from v3 → v4 with **ES Modules** and `@plugin` syntax
   * Includes all **30 built-in themes** for dynamic styling
2. **30+ Themes Support**
   * Users can now switch themes directly from the **Profile → Theme** section
   * Themes persist across sessions and reloads
3. **Sandbox Theme Update**
   * Default Sandbox theme changed from **Garden** to **Dracula** for better contrast and dark-mode consistency
4. **Analyze Mode Stability Fixes**
   * Prevented unintended theme switching while using Analyze Mode
   * Eliminated theme flickering during page navigation
   * Ensured theme persistence on browser minimize/restore

**Broker & API Fixes**

* Upstox Quotes API fixed
* Upstox P\&L and LTP updates corrected in Positionbook
* Angel BFO symbol format fixed
* Flattrade `placesmartorder` and modify order issues resolved
* General improvements to symbol consistency and broker-specific validations

**General UI Fixes**

* Alignment issues corrected across all broker login pages
* Updated FAQ section in the Help menu
* Improved consistency across modals, buttons, and theme transitions

***

#### Upgrade Instructions

For detailed steps: [https://docs.algo.wesoftcorp.com/getting-started/upgrade](https://docs.algo.wesoftcorp.com/getting-started/upgrade)

**Dependencies**

No new Python dependencies introduced.

**Configuration**

No database migration required for this release.\
`.env` v1.0.4 remains compatible.
