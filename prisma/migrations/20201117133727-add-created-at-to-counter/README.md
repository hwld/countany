# Migration `20201117133727-add-created-at-to-counter`

This migration has been generated by hwld at 11/17/2020, 10:37:27 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Counter" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startWith" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "maxValue" INTEGER NOT NULL,
    "minValue" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);
INSERT INTO "new_Counter" ("id", "value", "name", "startWith", "amount", "maxValue", "minValue", "userId") SELECT "id", "value", "name", "startWith", "amount", "maxValue", "minValue", "userId" FROM "Counter";
DROP TABLE "Counter";
ALTER TABLE "new_Counter" RENAME TO "Counter";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201115060000-create-credentials..20201117133727-add-created-at-to-counter
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 // datasource db {
 //   provider = "postgresql"
-//   url = "***"
+//   url = "***"
 // }
 // generator client {
 //   provider = "prisma-client-js"
@@ -12,9 +12,9 @@
 datasource sqlite {
   provider = ["sqlite", "postgresql"]
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -28,10 +28,12 @@
   startWith Int
   amount    Int
   maxValue  Int
   minValue  Int
+
   user      User    @relation(fields: [userId], references: [id])
   userId    Int
+  createdAt DateTime @default(now())
 }
 model User {
   id            Int       @default(autoincrement()) @id
```

