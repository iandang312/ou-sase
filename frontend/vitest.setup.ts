import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Testing Library only auto-registers its cleanup when Vitest `globals` are
// enabled. This project imports `describe`/`it` explicitly instead, so without
// this every render stays mounted and leaks into the next test's queries.
afterEach(cleanup);
