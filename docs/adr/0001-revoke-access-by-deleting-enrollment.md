# Revoke course access by deleting the enrollment

When a Refund becomes an Issued Refund, the learner's `enrollments` row is deleted rather than flagged with a `revokedAt` column. Access is defined by that row existing and 18 queries across 13 files read it, so a flag would need a filter at every one, and a single miss would leave a refunded learner with access. We accept losing the row's `enrolledAt` and `completedAt`: the Refund keeps the record of what happened, and progress, ratings and comments are keyed to the user and stay.

## Considered Options

- **`revokedAt` on `enrollments`**, matching the soft delete `comments` uses with `deletedAt`: keeps enrollment history, but makes correct access depend on every reader remembering the filter.
