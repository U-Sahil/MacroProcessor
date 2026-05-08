# Macro Processor – Pass 2 Error Handling Checklist

This checklist outlines the validation and expansion rules for the Pass 2 Macro Processor.
Completed items have been implemented, while the remaining items are pending.

---

## Completed

* [x] Macro expansion using MNT and MDT
* [x] Dynamic parameter replacement
* [x] Multiple macro invocation handling
* [x] Missing argument detection during macro call
* [x] START and END statement handling

---

## Core Errors (High Priority)

* [ ] Undefined macro invocation
* [ ] Incorrect number of parameters passed to macro

---

## Macro Expansion Errors

* [ ] Nested macro expansion handling
* [ ] Recursive macro call detection

---

## Semantic / Validation Errors

* [ ] Invalid parameter mapping
* [ ] Empty macro body expansion

---

## Goal

Ensure that Pass 2:

* Correctly expands macro calls using MNT and MDT
* Replaces formal parameters with actual arguments
* Generates final expanded code
* Detects expansion and invocation-related errors
* Prevents invalid macro calls from generating incorrect output

---