# Security Specification - BLOCKCHAIN App

## Data Invariants
1. A transaction must always belong to a `userId`.
2. A user can only read, update, or delete transactions where `resource.data.userId == request.auth.uid`.
3. A user can only create a transaction where `request.resource.data.userId == request.auth.uid`.
4. Email must be valid format.
5. Dollar and Euro amounts must be positive numbers.

## The Dirty Dozen Payloads
1. **The Identity Thief**: Create a transaction with `userId` of another user. (DENIED)
2. **The Shadow Update**: Update a transaction and change the `userId`. (DENIED)
3. **The Data Scraping**: List all transactions without filtering by `userId`. (DENIED)
4. **The Ghost Field**: Add a `verified: true` field to a transaction. (DENIED)
5. **The Negative Amount**: Set `amountUSD` to -100. (DENIED)
6. **The Large ID Poisoning**: Use a 2KB string as a transaction ID. (DENIED)
7. **The PII Leak**: Try to read another user's transaction details. (DENIED)
8. **The Timestamp Spoofer**: Provide a client-side `timestamp` in the past for a new record. (DENIED - we should use server timestamp if possible, but the blueprint said string. I will use server timestamp in rules).
9. **The Wallet Influx**: Inject a massive array into the `walletAddress` field. (DENIED)
10. **The Orphaned Record**: Create a transaction without any numeric amounts. (DENIED)
11. **The State Shortcut**: (Not applicable here as there's no status flow yet).
12. **The Unauthorized Admin**: Attempt to use admin-only paths (none currently defined). (DENIED)

## Test Plan
- Verify `create` requires auth and correct `userId`.
- Verify `list` only returns own items.
- Verify `update` is restricted to own items and specific fields.
- Verify `delete` is restricted to own items.
