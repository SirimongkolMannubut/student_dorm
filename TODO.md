# TODO: Integrate Registration into Login Modal

- [x] Modify src/components/LoginModal.tsx: Add state for mode ('login' or 'register'), update footer link to toggle modes, conditionally render LoginForm or RegistrationForm, update header title/subtitle based on mode.
- [x] Modify src/components/RegistrationForm.tsx: Accept onSuccess callback prop, call it with registered username on successful registration instead of redirecting.
- [x] Modify src/components/LoginForm.tsx: Accept initialUsername prop, set email state to it on mount.
- [ ] Test the integration by running the development server and verifying modal toggle and username pre-fill.
