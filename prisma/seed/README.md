# Database Seed Files

This directory contains SQL seed files for the Lumina database. The files are executed in a specific order to maintain referential integrity.

## Running the Seeds

Execute all seed files in order:

```bash
./seed.sh
```

## Notes

- All files use conflict-resistant INSERT statements with `NOT EXISTS` checks, making the seed scripts idempotent (safe to run multiple times).
- Course seed files should contain all relationships with their prerequisites, but not with their postrequisites.
- Module hierarchies and block prerequisites are properly established
- Course-module and degree-course relationships are maintained
