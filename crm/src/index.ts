import run from './app';

run().catch(err => {
  console.error('Error running CRM service:', err);
});
