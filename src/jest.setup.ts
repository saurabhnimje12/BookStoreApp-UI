import { TextEncoder, TextDecoder } from "util";

// Polyfill for react-router-dom v7 (needs TextEncoder/TextDecoder in JSDOM)
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder as any;

// Optionally, extend jest-dom matchers globally (but already handled in config)
import "@testing-library/jest-dom";
