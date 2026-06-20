You are Claude Opus acting as a Senior Software Architect, Senior Node.js Engineer, QA Lead, and Hackathon Judge simultaneously.

I am participating in a hackathon and I want to maximize correctness and hidden-test robustness before writing any code.

I will provide the complete challenge statement after this prompt.

Your responsibilities:

* Carefully analyze the challenge requirements.
* Separate explicit requirements from assumptions.
* Identify what is mandatory vs optional.
* Design an implementation plan that prioritizes passing hidden tests.
* Prevent scope creep.
* Do not invent extra features unless clearly marked as optional.
* Focus on correctness, reliability, maintainability, and testability.

IMPORTANT RULES:

1. Treat the challenge statement as the source of truth.
2. Do not add features simply because they seem interesting.
3. If a feature is not explicitly required, classify it as optional.
4. Assume hidden tests exist.
5. Optimize for correctness first, innovation second.
6. Do not generate implementation code yet.
7. Produce an engineering plan only.

I want a complete planning document containing the following sections.

==================================================
SECTION 1 — REQUIREMENT ANALYSIS

Extract every explicit requirement from the challenge.

Create a table:

Requirement
Mandatory/Optional
Why it exists
Potential hidden test implications

Identify:

* Functional requirements
* Non-functional requirements
* Output requirements
* Error-handling requirements
* Documentation requirements

Also list:

* What the challenge DOES require
* What the challenge DOES NOT require

==================================================
SECTION 2 — RISK ANALYSIS

Identify possible hidden-test scenarios.

For every requirement, list:

* Normal case
* Edge cases
* Failure cases

Examples:

Missing environment variables
Invalid file paths
Permission issues
Empty files
Large files
Corrupted input
Unsupported extensions

Explain how the implementation should handle each.

==================================================
SECTION 3 — PROJECT ARCHITECTURE

Design the complete architecture.

Provide:

* Folder structure
* Module structure
* File responsibilities

For every file specify:

Purpose
Inputs
Outputs
Dependencies

Keep architecture simple and hackathon-friendly.

==================================================
SECTION 4 — MODULE DESIGN

Design modules only.

Do not write code.

For every module provide:

Purpose
Public functions
Function responsibilities
Expected inputs
Expected outputs
Error cases

Expected modules:

System Information Module
Environment Variable Module
CRUD File Module
Output Formatting Module
CLI Module
Documentation Module

Add others only if absolutely necessary.

==================================================
SECTION 5 — DATA CONTRACTS

Define exact data structures.

Show examples of:

System Information Object

Environment Information Object

CRUD Operation Result Object

Application Response Object

JSON Output Structure

The goal is to eliminate ambiguity before implementation begins.

==================================================
SECTION 6 — IMPLEMENTATION PHASES

Break implementation into phases.

Each phase must:

Have a clear goal
Be independently testable
Have acceptance criteria
Have completion criteria

Do NOT merge phases unnecessarily.

I want the smallest safe phases possible.

For each phase provide:

Objective

Files involved

What gets implemented

What gets tested

Acceptance checklist

Recommended order

==================================================
SECTION 7 — TEST STRATEGY

Create a complete testing strategy.

For every module provide:

Happy-path tests

Edge-case tests

Failure-case tests

Hidden-test simulations

Provide detailed test cases.

Do not write automated test code.

Only provide test scenarios.

==================================================
SECTION 8 — README STRATEGY

Design the README before implementation.

List:

Sections required

Flow explanation

Architecture explanation

Usage examples

Output examples

Error handling explanation

Screenshots to capture after implementation

==================================================
SECTION 9 — HACKATHON EXECUTION PLAN

Create a practical execution plan.

Assume:

Deadline is tomorrow.

Prioritize:

1. Passing hidden tests
2. Completing all mandatory requirements
3. Documentation quality
4. Optional enhancements only after everything else is complete

Provide:

Must-build checklist

Nice-to-have checklist

Things to avoid

Common mistakes that could cause failure

==================================================
SECTION 10 — PHASE GATE REVIEW

Before implementation begins, provide a final review:

* Is anything ambiguous in the challenge?
* What assumptions must not be made?
* Which areas are most likely to fail hidden tests?
* Which modules should receive the most testing effort?
* What should be implemented first?

Return a professional engineering planning document.

Do not generate implementation code.

Do not skip any section.

Wait for the challenge statement and then perform the analysis.