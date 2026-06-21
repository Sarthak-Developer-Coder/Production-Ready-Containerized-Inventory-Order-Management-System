# TODO - Frontend UI upgrade

- [x] Step 0: Gather understanding of current UI + CSS structure (`App.css` vs `components/styles.css`) and inspect main components.
- [x] Step 1: Update `frontend/src/components/styles.css` to be component/atom-only (move global reset/body out), add `:focus-visible` improvements.
- [x] Step 2: Update `frontend/src/App.css` to take ownership of global reset + `body` base styles (font/background).
- [x] Step 3: Update `frontend/src/components/EnhancedOrderList.js` to remove inline title styling and use a CSS class instead.
- [x] Step 4: Add the new CSS class (e.g., `.order-summary-title`) to `frontend/src/components/styles.css`.

- [ ] Step 5: Build/test `frontend` (`npm run build`) to confirm no runtime/style issues.

- Note: Build command intermittently fails in this environment due to missing/temporary `react-scripts`/`npx` tooling dependencies (observed `react-scripts` command not recognized / `Cannot find module 'randombytes'`).



